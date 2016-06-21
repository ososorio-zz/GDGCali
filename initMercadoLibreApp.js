/**
 * Este archivo lo que realiza es configurar MELI,
 * Inicia el plugin del upload
 * Agrega el evento del click para el boton de login
 * incluye una funcionalidad llamada stringify
 * itemTranslate, es un enum que permite ubicar en lenguaje mas formal las opciones para crear un item
 * 
 */


//Init Api
//bug en el api de js al colocar https carga siemrpe http
MELI.init({
    client_id: 8219382526247995,
    xauth_protocol: "https://",
    xauth_domain: "secure.mlstatic.com",
    xd_url: "/org-img/sdk/xd-1.0.4.html"
});



$(document).ready(function() {

    //verificar cookie authenticacacion

    //Init principal Buttons and actions
    $("#processItem").click(function() {
        //validate all fields on form
        services.validateAndCreateItem(actions.getInfoForm());

        //services.createItem(actions.getInfoForm())
    });




    $("#cuserBTn").click(function() {
        services.cuserTest();
    });
    
     $("#loginBTn").click(function() {
        services.login();
    });
    

    //upload plugin
    $.cloudinary.config({
        cloud_name: 'ososorio',
        api_key: '677268276241899'
    })



});


/*
email: "test_user_41034836@testuser.com"
id: 198040704
nickname: "TETE4636408"
password: "qatest8197"
site_status: "active"
*/

//global
var imagesURL = [];
var informationPortal;
var actualcategory;
var attributescategory;

JSON.stringify = JSON.stringify || function(obj) {
    var t = typeof(obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
    } else {
        // recurse array or object
        var n, v, json = [],
            arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n];
            t = typeof(v);
            if (t == "string") v = '"' + v + '"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};


var itemTranslate={
    "used":"Usado",
    "not_specified":"No Especificar",
    "new":"Nuevo",
    "buy_it_now":"Compra ahora",
    "auction":" Subasta",
    
}