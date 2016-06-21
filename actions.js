/**
 * incluye todos los metodos que realizan acciones al dom del html.
 * @class
 * @classdesc 
 *   initPortal:  configura meli al portal del pais, inicia todos los elementos visuales y habilita modal, ademas activa el plugin para las imagenes
 *   getinfoform: obtiene la informacion del item base+ la informacion de los atributos si tiene
 *   fillSelectElements: esta funcion carga todos los select correspondientes a categorias y a monedas 
 *   updateFields: actualiza los campos de la forma con los valores de la categoria
 *   enableUploadplugin:  habilita el plugin para subir imagenes que realiza hosting en el servicio :
 *   validateItem: recibe la respuesta del servicio de validar y muestra su resultado o permite continuar para la crecion de un item
 *   validateCreateItem:  recibe la respuesta del servicio y posteriormente muestra el preview del item que se creo
 *   enableAttributes:  habilita visualmente los atributos de la categoria , obteniendo la respuesta esta se pasa a un motor de templates para su rederizado
 * 
 * @example
 * action.initportal(data);
 */
var actions = {

    initportal: function(data) {

        MELI.options.site_id = data.site_id;
        services.getCategories();

        $(".navbar-text.navbar-right").show();
        $("#nameUserA").html(data.nickname);
        $("#initialModal").hide();
        $("#createItemsMaincontent").show();
        $("#myModal").modal("show");
        $("#reload").click(function() {
            location.reload();
        });

        actions.enableUploadplugin();


    },

    getInfoForm: function() {


        var paramItem = {
            title: $("input[name='title']").val(),
            category_id: $("input[name='categoryVal']").val(),
            price: $("input[name='price']").val(),
            currency_id: $('#currency option:selected').val(),
            available_quantity: $("input[name='quantity']").val(),
            buying_mode: $('#typesell option:selected').val(),
            listing_type_id:"free", //"silver",//"free",
            condition: $('#condition option:selected').val(),
            description: $("textarea[name='description']").val(),
            video_id: $("textarea[name='youtube']").val(),
            warranty: $("input[name='warranty']").val(),
            pictures: imagesURL,
            attributes: [],
            
            location: {
                        "address_line": "My property address 1234",
                        "zip_code": "1111",
                        "neighborhood": {
                          "id": "TUxBQlBBUzgyNjBa"
                        },
                        "latitude": -34.48755,
                        "longitude": -58.56987,
                      }
        };


        $.each( $("#result").serializeArray(), function( n, object ) {
            
            if( object.value == null || object.value == "" ) {
                console.info("Contiene un valor en nulo");
                 $("#messageError").html("Revise los parametros requeridos, existe almenos uno que no contiene informacion");
                  $("#alertError").show().delay(8200).fadeOut();
                  

            }
            
            paramItem.attributes.push({"id":object.name,"value_name":object.value})//"value_id":object.value,
              // paramItem[object.name] = object.value;
            });

        return paramItem;
    },

    fillSelectElements: function() {
        //informationPortal use var global to update values
        $('#dinamycCat').empty().append(
            $('<option></option>').val("").html("Selecciona una opcion")
        );

        $.each(informationPortal.categories, function(val, text) {
            $('#categoriesMain').append(
                $('<option></option>').val(text.id).html(text.name)
            );

            $("#dinamycCat").append(
                $('<option></option>').val(text.id).html(text.name)
            );
        });

        $.each(informationPortal.currencies, function(val, text) {
            $('#currency').append(
                $('<option></option>').val(text.id).html(text.id)
            );
            //currencies pending cheked
            $('#currency option[value="' + informationPortal.default_currency_id + '"]').prop('selected', true)
        });
    },

     updateFields: function(updateFields){
          $('#condition,#tipesell').empty();
          
          
             $.each(updateFields.settings.buying_modes, function(val, text) {
                    $('#tipesell').append(
                        $('<option></option>').val(text).html(itemTranslate[text])
                    ); 
                    
            });
                    
             $.each(updateFields.settings.item_conditions, function(val, text) {
                    $('#condition').append(
                        $('<option></option>').val(text).html(itemTranslate[text])
                    ); 
                    
            });
     },


    enableEventOnCategories: function() {
        $("#dinamycCat").change(function(rta) {

            $("#dinamycCat").hide();
            $("#loadingcat").show();


            $('#breadcrumbCat,#breadcrumbRead').append($("<li></li>").html($('#dinamycCat option:selected').text()));

            getSubcat = $('#dinamycCat').val();
            $.when(services.getCategoriesService(getSubcat)).done(function(categoriesrta) {
                actions.updateFields(categoriesrta);
                if (categoriesrta.children_categories.length == 0) {
                    $("input[name='categoryVal']").val($('#dinamycCat').val());
                    $("input[name='category']").val($('#dinamycCat option:selected').text());
                    //categoryVal
                    
                    $('#dinamycCat').val();
                    
                        $.when(services.getCategoriesAttributes()).done(function(data){
                            $("#myModal").modal("hide");
                            
                            if(attributescategory !=undefined && attributescategory.length >0) 
                            {
                                $("#atributtesform").show();
                            }
                            
                            actions.enableAttributes();
                        });
 
                    return false;
                }

                $('#dinamycCat').empty().append(
                    $('<option></option>').val("").html("Selecciona una opcion")
                );

                $.each(categoriesrta.children_categories, function(val, text) {
                    $('#dinamycCat').append(
                        $('<option></option>').val(text.id).html(text.name)
                    );

                });


                $("#loadingcat").hide();
                $("#dinamycCat").show();

            });
        });


    },

    enableUploadplugin: function() {

        $('#upload_form').append($.cloudinary.unsigned_upload_tag("o0qtcdrz", {
            cloud_name: 'ososorio'
        }));


        $('.cloudinary_fileupload ').unsigned_cloudinary_upload("o0qtcdrz", {
            cloud_name: 'ososorio',
            tags: 'browser_uploads'
        }, {
            multiple: false
        }).bind('cloudinarydone', function(e, data) {

                //data.result.url

                var added = false;
                productIMG = data.result.url;
                $.map(imagesURL, function(elementOfArray, indexInArray) {
                    if (elementOfArray.source == productIMG) {
                        added = true;
                    }
                });

                if (added == false) {

                    imagesURL.push({
                        "source": data.result.url
                    });



                    $('.thumbnails').append($.cloudinary.image(data.result.public_id, {
                        format: 'jpg',
                        width: 100,
                        height: 100,
                        crop: 'thumb',
                        gravity: 'face',
                        effect: 'saturation:50',
                        class: "img-thumbnail"
                    }))


                    $("#loadingImage").hide();
                }

            }

        ).bind('cloudinaryprogress', function(e, data) {

            $("#loadingImage").show();

        });

    },

    validateItem: function(data, paramItem) {

        if (data[0] == 204  || data[0] == 402 ) {
            services.createItem(paramItem);

        } else {

            var str = "ocurrio un error";
            if (data[2].cause) {
                str = JSON.stringify(data[2].cause)
            } else {
                str = data[2].message
            }

            $("#messageError").html(str);
            $("#alertError").show().delay(8200).fadeOut();
            console.info(data)
        }

    },

    validateCreateItem: function(data) {
        if (data[0] == 201 || data[0] == 402 ) {
            $("#createItemsMaincontent").hide();
            $("#previewItem").show();
            $("#previewItemIframe").attr('src', data[2].permalink);

        } else {
            //mostrar el error
            var str = "ocurrio un error";
            if (data[2].cause) {
                str = JSON.stringify(data[2].cause)
            } else {
                str = data[2].message
            }

            $("#messageError").html(str);
            $("#alertError").show().delay(8200).fadeOut();

            console.info(data)
        }

    },
    
    enableAttributes: function(){
        $('#result').submit(false);
    var template = $.templates("#tmplattributes");
     $.each(attributescategory,function( index, value ) {
        if(value.tags.required != undefined){
       // console.info(value.name);
        var htmlOutput = template.render(value);
        $("#result").append(htmlOutput);
        }
     });
        
    }




};