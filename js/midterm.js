//All the code goes here.

var ajax_requester = new XMLHttpRequest( );//Define variable for AJAX requests.
var newinfo, oldinfo, loadbutton, nextbutton;
//Variables for webpage objects:
//isloaded controls buttons based on data loaded; content and content_index are for scrolling through the data we'll be loading.
var isloaded=false;
var content ={};
var content_index=0;

document.addEventListener("DOMContentLoaded",main);//Prepare for a full page load.

function main()
{
    newinfo=document.querySelector("#output1"); //Elements from the webpage where we'll be dumping output.
    oldinfo=document.querySelector("#output2");
    loadbutton=document.querySelector("#loadBtn"); //The buttons which will control output.
    nextbutton=document.querySelector("#showBtn");
    
    loadbutton.addEventListener("click",loaddata); //Since the page is only to run when a button is clicked, we're done here.
}


function loaddata() //This loads the data and then sets up a new click event.
{
    if (!isloaded)//Because there's no need to load the data multiple times, let's filter extra clicks.
    {
        isloaded=true;
        loadbutton.classList.remove("enabled"); //Gray out the load data button for visual reinforcement.
        loadbutton.classList.add("disabled");
        ajax_requester.open('GET', 'js/users.json', true ); //Establish the data to be loaded.
        ajax_requester.send(); //LOAD IT!
        ajax_requester.onreadystatechange = function( )//Data/error handler
        { 
            if(ajax_requester.readyState == 4)//Figurative green light lit.
            {
                if(ajax_requester.status == 200 || ajax_requester.status==304)//Loaded or cached
                {
                    nextbutton.classList.remove("disabled"); //Good to go, light up the next button.
                    nextbutton.classList.add("enabled");
                    content = JSON.parse( ajax_requester.responseText );

                    nextbutton.addEventListener("click",nextdata);
                }
                else
                {
                    console.log("Non-200 event.");//Other error handling can go here.
                }
            }
            else
            {
                console.log("non-4 ready state.");//Non-ready error handling can go here.
            }
        }
    }
}


function nextdata() //This is for scrolling through the data.  Easy stuff.
{
    var index, oldboxtext, con_temp;//In order: An index for scrolling through archived data, the data for the archived data output, a variable for legibility.
    if (content_index < content.length)
    {
        con_temp=content[content_index];
        newinfo.innerHTML="<img src='"+con_temp.image+"'\><h2>"+nameparse(con_temp.firstName,con_temp.lastName)+"</h2><a href='mailto://"+con_temp.email+"'>"+con_temp.email+"</a>";//Writing new data to the new data box.
        oldboxtext="";
        for (var index=content_index-3;index<content_index;index++) //Looping through the three previous name entries.
        {
            if (index >= 0)//The first few boxes could have an array index in the negatives, so skip those.
            {
                con_temp=content[index];//Just to make the next line a little cleaner to read.
                oldboxtext=oldboxtext+"<div><img src='"+con_temp.thumbnail+"'\><a href='mailto://"+con_temp.email+"'>"+nameparse(con_temp.firstName,con_temp.lastName)+"</a></div>";
            }
        }
        oldinfo.innerHTML=oldboxtext;//OuTPUT to old box.
        if(content_index==0)//After the first clickthrough, let's change the name.
        {
            nextbutton.innerHTML="Show Next";
        }
        content_index++;
    }
    else
    {
        nextbutton.classList.add("disabled");
        nextbutton.classList.remove("enabled");
    }
}

function nameparse(first, last)//Breaking up converting the names to proper name case; broken out here simply for legibility.
{
    return first.substring(0,1).toUpperCase()+first.substring(1,first.length)+" "+last.substring(0,1).toUpperCase()+last.substring(1,last.length);
}
