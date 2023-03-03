$('#main').append(`<div id='mainText' class='center'></div>`)
const charType = ['Combat','Commoner','Nobility','Big Bad Boss','Quest Contact','Patron']


function getChars(){
    $.get('http://localhost:3000/api/npctype/all/chars', (data)=>{
        console.log(data);
        for (let i=0;i<data.length;i++){
            const name = data[i].char_name;
            const race = data[i].race;
            const clas = data[i].class;
            const hp = data[i].hit_points;
            const bg = data[i].background;
            const type = data[i].type_id;
            let finalType;
            if (type == 1){
                finalType = charType[0];
            } else if (type == 2) {
                finalType = charType[1];
            } else if (type == 3) {
                finalType = charType[2];
            } else if (type == 4) {
                finalType = charType[3];
            } else if (type == 5) {
                finalType = charType[4];
            } else if (type == 6) {
                finalType = charType[5];
            }
            $('#mainText').append(`<div id='subText${i}'></div>`);
            $(`#subText${i}`).append(`<h1 id='header${i}'></h1>`);
            $(`#header${i}`).text(`${name}`);
            $(`#subText${i}`).append(`<p id='extraText${i}'></p>`);
            $(`#extraText${i}`).html(`Race: ${race} <br> Class: ${clas} <br> Hit Points: ${hp} <br> 
            Background: ${bg} <br> NPC Type: ${finalType}`);
        }
    })
}


getChars();