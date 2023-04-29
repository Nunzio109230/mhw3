/* TODO: inserite il codice JavaScript necessario a completare il MHW! */
function controlla(id, blocco){
    let leng=parseInt(choisenBlocks.length);
    for(let i=0; i<leng; i++){
        if(choisenBlocks.length===3 && choisenBlocks[0]!==choisenBlocks[1] && choisenBlocks[0]!==[2] && choisenBlocks[1]!==choisenBlocks[2] && choisenBlocks[2]!==choisenBlocks[0]) 
            return;
        else{
            for(let j=1; j<=i; j++){
                if(choisenBlocks[j]===id){
                choisenBlocks.splice(i,1);
                choiceId.splice(i,1);
                deselezione(id);
                }
            }
        }
    }
    blocco.removeEventListener('click', controlla);
}

function comando(event){
    const blocco=event.currentTarget;
    if(choisenBlocks==''){
        deselezione(blocco.dataset.questionId);
        selezione(blocco);
        choisenBlocks.push(blocco.dataset.questionId);
        choiceId.push(blocco.dataset.choiceId);
        controlla(blocco.dataset.questionId,blocco);
        console.log(choiceId);
    }else{ 
        if(parseInt(choisenBlocks.length)<3){
            choisenBlocks.unshift(blocco.dataset.questionId);
            choiceId.unshift(blocco.dataset.choiceId);
            controlla(blocco.dataset.questionId,blocco);
            deselezione(blocco.dataset.questionId);
            selezione(blocco);
            console.log(choiceId);
            if(parseInt(choiceId.length)===3) result();
        }
    }
    removeEventListener('click', comando);
}

function result(){
    //ricordiamo che i valori sono inseriti con unshift
    let risultato;
    if(choiceId[0]===choiceId[1] || choiceId[0]===choiceId[2])risultato=choiceId[0];
    if(choiceId[1]===choiceId[2]) risultato=choiceId[1];
    if(risultato===undefined)risultato=choiceId[2];
    console.log(risultato);
    complete(risultato);
}

function complete(risultato){
    const resultContainer=document.querySelector('.beforeComplete');
     resultContainer.classList.add('risultato');
    resultContainer.classList.remove('beforeComplete');
    const title=document.querySelector('.risultato .titolo h1');
    const testo=document.querySelector('.risultato .testo');
    for(let key in RESULTS_MAP)
        if(key===risultato){
            title.textContent=RESULTS_MAP[risultato].title;
            testo.textContent=RESULTS_MAP[risultato].contents;
        }
}


function deselezione(id){
    if(id==="one"){
        const img= document.querySelectorAll("#one .checkbox");
        const blocc=document.querySelectorAll("#one div")
        for(let image of img)
            image.src="./images/unchecked.png";
        for(let block of blocc){
            block.classList.remove('checked');
            block.classList.add('unchecked');
        }
    }
    if(id==="two"){
        const img= document.querySelectorAll("#two .checkbox");
        const blocc=document.querySelectorAll("#two div")
        for(let image of img)
            image.src="./images/unchecked.png";
        for(let block of blocc){
            block.classList.remove('checked');
            block.classList.add('unchecked');
        }
    }
    if(id==="three"){
        const img= document.querySelectorAll("#three .checkbox");
        const blocc=document.querySelectorAll("#three div")
        for(let image of img)
            image.src="./images/unchecked.png";
        for(let block of blocc){
            block.classList.remove('checked');
            block.classList.add('unchecked');
        }
    }
}

function AllUnchecked(){
    const resultContainer=document.querySelector('.risultato');
    resultContainer.classList.remove('risultato');
    resultContainer.classList.add('beforeComplete');
    const blocco=document.querySelectorAll('.choice-grid div')
    const img=document.querySelectorAll('.choice-grid .checkbox');
    for(let image of img){
        image.src="./images/unchecked.png";
    }
    for(let block of blocco){
        block.classList.remove("unchecked");
        block.classList.remove("checked")
    }
    for(let i=0; i<3; i++){
        choiceId.pop();
        choisenBlocks.pop();
    }
}

function selezione(blocco){
    const image= blocco.querySelector('.checkbox');
    image.src="./images/checked.png";
    blocco.classList.remove('unchecked');
    blocco.classList.add('checked');
    blocco.removeEventListener('click', selezione);
    
}
/*REST API League Of Legends*/
/*LISTA PLAYER DI PROVA:
1.Beanovich
2.Razørk Activoo
3.G2 Joker
4.Caligolalll
*/
let summoner;
let imgChamp={};
let nameChamp={};
const LoL_key="RGAPI-192f5504-48a4-4bb2-856f-63a2fee1864d";//ATTENZIONE:Questa chiave è provvisoria
function search(event){
    event.preventDefault();
    const summoner_input=document.querySelector("#content");
    const summoner_value=encodeURIComponent(summoner_input.value);
    console.log("Eseguo la ricerca di " + summoner_value+"...");
    const server=document.querySelector("#server").value
    fetch('https://'+server+'.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+summoner_value+'?api_key='+LoL_key)
    .then(OnResponse)
    .then(OnJsonId)
    .then(Champ);
}

function OnResponse(response){
    console.log('Risposta ricevuta');
    return response.json();
}

function OnJsonId(json){
    console.log('Json con id ricevuto');
    console.log(json);
    summoner=json.id;
}
function Champ(){
    fetch("champion.json")
    .then(OnResponse)
    .then(JsonChamp)
}

function JsonChamp(json){
    console.log("Json champ ricevuto");
    console.log(json);
    const n_valori=document.querySelector("#n_valori").value;
    const server=document.querySelector("#server").value;
    for(let i=0;i<json.length;i++){
        imgChamp[json[i].key]=json[i].icon;
        nameChamp[json[i].key]=json[i].name;
    }
    console.log("//////////////////////");
    console.log(imgChamp);
    console.log(nameChamp);
    fetch("https://"+server+".api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/"+summoner+"/top?count="+n_valori+"&api_key="+LoL_key)
        .then(OnResponse)
        .then(OnJson);
}

function OnJson(json){
    const n_valori=document.querySelector("#n_valori").value;
    console.log("Json con valori maestria ricevuto");
    console.log(json);
    let list=document.querySelector(".data_form");
    list.innerHTML="";
    for(let i=0;i<n_valori;i++){
        const img=document.createElement('img');
        img.src=imgChamp[json[i].championId];
        const name=document.createElement('strong');
        name.innerHTML=nameChamp[json[i].championId];
        const div=document.createElement('div');
        const h41=document.createElement('h4');
        h41.innerHTML="Mastery Level: "+ json[i].championLevel;
        const h42=document.createElement('h4');
        h42.innerHTML="Champion Points:   "+json[i].championPoints + " points";
        const h43=document.createElement('h4');
        h43.innerHTML="Tokens Earned: "+json[i].tokensEarned;
        div.appendChild(img);
        div.appendChild(name);
        div.appendChild(h41);
        div.appendChild(h42);
        div.appendChild(h43);
        list.appendChild(div);
    }
    console.log(list);
    
}

/*FINE REST API League Of Legends*/
/*INIZIO REST API gfycat (oAuth2.0)*/
/*LISTA STREAMER DI PROVA:
1.pizfn
2.Tfue
3.Brizz94
4.Santill1
*/
function twitch_search(event){
    event.preventDefault();
    const streamer_input=document.querySelector("#twitch_content");
    const streamer_value=encodeURIComponent(streamer_input.value);
    console.log("Eseguo la ricerca di " + streamer_value+"...");
    
    fetch("https://api.twitch.tv/helix/users?login="+streamer_value,
    {
      headers:
      {
        'Authorization': 'Bearer ' + token,
        'Client-Id':"20391upng2b9k4ywit8qop8rstxlhh"
      }
    }
  ).then(OnResponse).then(onJson_streamer_id);
}

function TokenJson(json)
{
    console.log("Token")
    console.log(json)
    token = json.access_token;
}

function TokenResponse(response)
{
  return response.json();
}
let token;

fetch("https://id.twitch.tv/oauth2/token",
{
    method: "post",
    body:'client_id=20391upng2b9k4ywit8qop8rstxlhh&client_secret=u4lpta8n7lhpa8ta4xf914f4cj4hu4&grant_type=client_credentials',
    headers:
    {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}
).then(TokenResponse).then(TokenJson);


  function onJson_streamer_id(json) {
    console.log('JSON ricevuto');
    console.log(json);
    fetch("https://api.twitch.tv/helix/videos?user_id="+json.data[0].id,
    {
      headers:
      {
        'Authorization': 'Bearer ' + token,
        'Client-Id':"20391upng2b9k4ywit8qop8rstxlhh"
      }
    }
  ).then(OnResponse).then(onJson_videos);
  }

  function onJson_videos(json){
    console.log("Json con video qui:");
    console.log(json);
    let list=document.querySelector(".twitch_data_form");
    list.innerHTML='';
    let streamer=document.createElement('h1');
    streamer.innerHTML=json.data[0].user_login;
    list.appendChild(streamer);
    if(json.data.length>10)json.data.length=10;
    for(let i=0;i<json.data.length;i++){
        let div=document.createElement('div');
        let url=document.createElement('a')
        let title=document.createElement('h2');
        let duration=document.createElement('h5');
        let published=document.createElement('h5');
        duration=json.data[i].duration;
        title.innerHTML="Video: "+"<br>"+ json.data[i].title + "("+duration+")";
        url.href=json.data[i].url;
        url.innerHTML='URL: '+json.data[i].url;
        published.innerHTML=json.data[i].published_at
        div.appendChild(title);
        div.appendChild(published);
        div.appendChild(url);
        
        list.appendChild(div);;
    }console.log(list)
  }
/*FINE REST API gfycat (oAuth2.0)*/


//l'idea è che io posso fare una list dove metto i blocchi scelti. Devo fare in modo che la lista dei blocchi scelti abbia tre valori
//e che questi valori abbiamo question-id diversi, quando i question-id sono uguali viene rimosso dalla lista il question-id e viene inserito quello nuovo.
//mi serve anche una lista che deve contenere i vari choice-id
const choisenBlocks=[]; //contiene i question-id
const choiceId=[]; //contiene i choce-id;
const blocchi = document.querySelectorAll('.choice-grid div');
for (let blocco of blocchi){
    blocco.addEventListener('click',comando);
}
let form=document.querySelector('#search_content');
form.addEventListener('submit', search);
let twitch_form=document.querySelector("#twitch_search_content");
twitch_form.addEventListener('submit', twitch_search);
const button=document.querySelector('.button');
button.addEventListener('click', AllUnchecked);