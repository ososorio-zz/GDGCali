/**
 * incluye todos los metodos que realizan peticiones al api de mercado libre.
 * @class
 * @classdesc 
 *   createItem:  envia la peticion para crear un item
 *   validateAndCreateItem: envia una peticion para validar si los parametros del item estan y son los correctos
 *   login: realiza solicitud de login 
 *   getInfoUser: obtiene los datos base del usuario
 *   getCategories: obtiene las categorias a las cuales tiene acceso el sitio
 *   getCategoriesService: obtiene las subcategorias
 *   getCategoriesAttributes obtiene los atributos de las categorias
 * 
 * @example
 * services.createItem(paramItem);
 */


var services = {
    createItem: function(paramItem) {
        var uri = "/items?access_token=" + MELI.getToken()
        MELI.post(uri, paramItem, function(data) {
            //manejo errores con aleta notificacion
            actions.validateCreateItem(data);

        });
    },
    validateAndCreateItem: function(paramItem) {
        var uri = "/items/validate?access_token=" + MELI.getToken()

        MELI.post(uri, paramItem, function(data) {
            //manejo errores con aleta notificacion
            actions.validateItem(data, paramItem);

        });
    },

    login: function() {
        MELI.login(function() {
            services.getInfoUser();
        });
    },
    
    cuserTest:function(){
        
         MELI.post(
            "/users/test_user", {
                "site_id":"MCO"
            },
            function(data) {
                alert(data);
                console.info(data);
                //actions.initportal(data[2])
            }
        );
    },

    getInfoUser: function() {
        MELI.get(
            "/users/me", {},
            function(data) {
                actions.initportal(data[2])
            }
        );
    },


    getCategories: function() {
        //aparenta ser un bug al realizar el login oauth, ya que soporta creacion para co pero envia arg
        //MELI.options.site_id="MCO"
        MELI.get("/sites/" + MELI.options.site_id, {}, function(response) {
            informationPortal = response[2];
            actions.fillSelectElements();
        });
        actions.enableEventOnCategories();
    },

    getCategoriesService: function(category) {
        var d = $.Deferred()
        MELI.get("/categories/" + category, {}, function(response) {
            actualcategory = response[2];
            return d.resolve(response[2]);
        });
        return d.promise();

    },
    
    getCategoriesAttributes: function()
    {
         var d = $.Deferred()
         MELI.get("/categories/"+actualcategory.id+"/attributes", {}, function(response) {
            attributescategory = response[2];
            return d.resolve(response[2]);
        });
         return d.promise();
    }

};