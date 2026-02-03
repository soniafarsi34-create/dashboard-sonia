let dataGlobal = [];
let dark = false;

fetch("data.csv")
.then(res => res.text())
.then(csv => {

    Papa.parse(csv,{
        header:true,
        dynamicTyping:true,
        complete:(res)=>{
            dataGlobal = res.data;
            setupFilters();
            buildCharts(dataGlobal);
        }
    });

});


// FILTRI

function setupFilters(){

    let mesi = [...new Set(dataGlobal.map(d=>d.MeseNorm))];
    let anni = [...new Set(dataGlobal.map(d=>d.anno))];

    let meseSel = document.getElementById("meseFilter");
    let annoSel = document.getElementById("annoFilter");

    meseSel.innerHTML = `<option value="all">Tutti i mesi</option>`;
    annoSel.innerHTML = `<option value="all">Tutti gli anni</option>`;

    mesi.forEach(m=>{
        meseSel.innerHTML+=`<option>${m}</option>`;
    });

    anni.forEach(a=>{
        annoSel.innerHTML+=`<option>${a}</option>`;
    });

    meseSel.onchange = filterData;
    annoSel.onchange = filterData;
}


function filterData(){

    let mese = meseFilter.value;
    let anno = annoFilter.value;

    let filtered = dataGlobal.filter(d=>{

        return (mese==="all" || d.MeseNorm==mese) &&
               (anno==="all" || d.anno==anno);

    });

    buildCharts(filtered);
}



// COSTRUZIONE GRAFICI

function buildCharts(data){

    buildLine(data);
    buildBar(data);
    buildPie(data);
    buildScatter(data);
    buildArea(data);
}



// 1️⃣ LINE

function buildLine(data){

    let mesi = data.map(d=>d.MeseNorm);
    let tot = data.map(d=>d["totale vendite"]);

    new Chart(lineChart,{
        type:"line",
        data:{
            labels:mesi,
            datasets:[{
                label:"Vendite",
                data:tot,
                borderWidth:2
            }]
        }
    });
}



// 2️⃣ BAR

function buildBar(data){

    let map = {};

    data.forEach(d=>{
        map[d.TIPOLOGIA] = (map[d.TIPOLOGIA]||0)+d["totale vendite"];
    });

    new Chart(barChart,{
        type:"bar",
        data:{
            labels:Object.keys(map),
            datasets:[{
                label:"Per Tipologia",
                data:Object.values(map)
            }]
        }
    });
}



// 3️⃣ PIE

function buildPie(data){

    let map = {};

    data.forEach(d=>{
        map[d["luogo di vendita"]] = 
        (map[d["luogo di vendita"]]||0)+1;
    });

    new Chart(pieChart,{
        type:"pie",
        data:{
            labels:Object.keys(map),
            datasets:[{
                data:Object.values(map)
            }]
        }
    });
}



// 4️⃣ SCATTER

function buildScatter(data){

    let points = data.map(d=>{
        return {
            x:d["prezzo di vendita"],
            y:d["trasporto al cliente"]+d.restauro
        };
    });

    new Chart(scatterChart,{
        type:"scatter",
        data:{
            datasets:[{
                label:"Prezzo vs Costi",
                data:points
            }]
        }
    });
}



// 5️⃣ AREA

function buildArea(data){

    let sum = 0;

    let cumul = data.map(d=>{
        sum+=d["totale vendite"];
        return sum;
    });

    new Chart(areaChart,{
        type:"line",
        data:{
            labels:data.map(d=>d.MeseNorm),
            datasets:[{
                fill:true,
                label:"Cumulativo",
                data:cumul
            }]
        }
    });
}



// DARK MODE

function toggleDark(){

    dark = !dark;

    document.body.classList.toggle("dark");
}
