function api(object, action, params, callback) {
    var url = '';
    url = "/api/" + object + "/" + action;
    $.getJSON(url, params, callback);
}

function uploadFileStart(file)
{
    $('#nastaveni-foto').html('<div id="foto-progress"><p></p></div>');
}
function uploadProgress(file, bytesloaded, bytestotal) {
	var progress = document.getElementById("yourprogressid");
	var percent = Math.ceil((bytesloaded / bytestotal) * 160);
	$('#foto-progress p').width(percent);	
}
function uploadComplete()
{
    var stamp = new Date();
    if($('#student_id').val())
    {
        $('#nastaveni-foto').html('<img src="/firma/foto/?student_id=' + $('#student_id').val() + '&ident=' + stamp + '" />');
    }
    else
    {
        $('#nastaveni-foto').html('<img src="/firma/foto/?ucitel_id=' + $('#ucitel_id').val() + '&ident=' + stamp + '" />');
    }
}

function canHtml5Audio()
{
    var a = document.createElement('audio');
    return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}

$(document).ready(function()
{
    //$('.collapse').collapse();
    $("table.table tr.clickable-row").click(function() {
        window.document.location = $(this).data("href");
    });
    $('#test .test-otazka-volba li').click(function() {
        var radio = $('input.radio, input.checkbox', $(this));
        if(!radio.is(':checked'))
        {
            radio.prop('checked', true);            
        }
    });
    $('#test .test-otazka-volba li').hover(function() {
        $(this).addClass('checked');
    }, function() {
        $(this).removeClass('checked');
    });
    if($('#test .test-otazka-soubor').length)
    {
        $('#test .test-otazka-soubor').each(function(el)
        {
            var otazka = $(el);
            $(':file', el).change(function()
            {
                var file = this.files[0];
                var name = file.name;
                var size = file.size;
                var type = file.type;

                var otazka_id = $(this).attr('id').split('_')[1];
                var otazka = $('#otazka_' + otazka_id);

                $('<progress />').insertAfter($('button.test-form-upload-button', otazka));
                $('button.test-form-upload-button').hide();
                $('button.test-form-delete-button', otazka).hide();
                var formData = new FormData($('#test-form-upload')[0]);
                $.ajax({
                    url: '/test/file',  //Server script to process data
                    type: 'POST',
                    xhr: function() 
                    {  // Custom XMLHttpRequest
                        var myXhr = $.ajaxSettings.xhr();
                        if(myXhr.upload)
                        { // Check if upload property exists
                            myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
                        }
                        return myXhr;
                    },
                    //Ajax events
                    beforeSend: function() {},
                    success: function(res) 
                    {
                        $('progress', otazka).remove();
                        $('button.test-form-upload-button').show();
                        if(res != 'error')
                        {
                            $('h3', otazka).remove();
                            var h3 = $('<h3 />');
                            h3.insertBefore($('button.test-form-upload-button', otazka));
                            var file = $('#test-form-upload :file')[0].files[0];
                            h3.append('<span class="label label-bg label-default"><span class="glyphicon glyphicon-file"></span> ' + file.name + ' <small>(' + formatSizeUnits(file.size) + ')</small></span>');
                            $('button.test-form-delete-button', otazka).show();
                            $("input[name='otazka_" + otazka_id + "']").attr('value', res);

                        }
                        else
                        {
                            alert('Chyba pří nahrávání souboru');
                        }
                        $("#test-form-upload :file").val('');
                    },
                    error: function(res) 
                    {
                        alert('Chyba pří nahrávání souboru');
                        $('progress', otazka).remove();
                        $('h3', otazka).remove();
                        $('button.test-form-upload-button').show();
                        $("input[name='otazka_" + otazka_id + "']").attr('value', '');
                        $("#test-form-upload :file").val('');
                    },
                    // Form data
                    data: formData,
                    //Options to tell jQuery not to process data or worry about content-type.
                    cache: false,
                    contentType: false,
                    processData: false
                });
                function progressHandlingFunction(e)
                {
                    if(e.lengthComputable)
                    {
                        $('progress', el).attr({value:e.loaded,max:e.total});
                    }
                }
            });
            $('button.test-form-upload-button', el).click(function(){
                var otazka_id = $(this).attr('id').split('_')[1];
                var file = $('#test-form-upload :file');
                file.attr('id', 'fileotazka_' + otazka_id);
                file.click();
                return false;
            });
            $('button.test-form-delete-button', el).click(function(){
                var otazka_id = $(this).attr('id').split('_')[1];
                var otazka = $('#otazka_' + otazka_id);
                $("input[name='otazka_" + otazka_id + "']").attr('value', '');
                $('h3', otazka).remove();
                $(this).hide();
                return false;
            });
        });
    }
    if($('#test.onequestion').length)
    {
        var qactive = $('.otazka').first();
        var iactive = $('.instrukce').first();
        $('.instrukce').hide();
        $('.instrukce').first().show();
        $('.otazka').hide();
        $('.otazka').first().show();
        $('#test-done').hide();
        $('#test-prev').hide();
        $('#test-next').click(function() {
            qactive = $('.otazka:visible');
            iactive = $('.instrukce:visible');
            $('#test-prev').show();
            qactive.hide();
            qactive = qactive.next();
            if(qactive.length == 0)
            {
                if(iactive.next().length != 0)
                {
                    iactive.hide();
                    iactive = iactive.next();
                    iactive.show();
                    qactive = $('.otazka', iactive).first();
                }
                else
                {
                    qactive = $('.otazka', iactive).last();
                }
            }
            qactive.show();
            if(qactive.next().length == 0 && iactive.next().length == 0)
            {
                $('#test-next').hide();
                $('#test-done').show();
            }
            if (typeof testNextClickDone == 'function') { testNextClickDone(iactive, qactive); }
            return false;
        });
        $('#test-prev').click(function() {
            qactive = $('.otazka:visible');
            iactive = $('.instrukce:visible');
            $('#test-next').show();
            $('#test-done').hide();

            qactive.hide();
            qactive = qactive.prev();
            if(qactive.length == 0)
            {
                if(iactive.prev().length != 0)
                {
                    iactive.hide();
                    iactive = iactive.prev();
                    iactive.show();
                    qactive = $('.otazka', iactive).last();
                }
                else
                {
                    qactive = $('.otazka', iactive).first();
                }
            }
            qactive.show();
            if(qactive.prev().length == 0 && !iactive.prev().is('div.instrukce'))
            {
                $('#test-prev').hide();
            }
            if (typeof testPrevClickDone == 'function') { testPrevClickDone(iactive, qactive); }
            return false;
        });
    }
    $('a.show_category_description').click(function() {
        var id=$(this).attr('id').split('_')[1];
        $('#category_description_' + id).toggle().removeClass('hidden');
        return false;
    });
    $('#test-form').submit(function() {
        window.onbeforeunload = false;
        return confirm(_lang['Submit test'] + ' ?');
    });
    $('.multipages').each(function(i, el) {
        $('input[type=submit][name=submit]').remove();
        _this = $(this);
        var celkem = $('.multipages').length;
        var div = $(document.createElement('div'));
        if(i != 0)
        {
            var input = $('<button class="btn"><span class="blue large"><span><< Zpět</span></span></button>');
            div.append(input);
            input.click(function() 
            {
                $('.multipages').each(function(ii, ell) 
                {
                    if(ii == i - 1)
                    {
                        $(this).show();
                    }
                });
                input.parent().parent().hide();
                input.blur();
                scroll(0,0);
                return false;
            });
        }
        if(i != celkem - 1)
        {
            var input = $('<button class="btn"><span class="blue large"><span>Další >></span></span></button>');
            input.click(function() 
            {
                $('.multipages').each(function(ii, ell) 
                {
                    if(ii == i + 1)
                    {
                        $(this).show();
                    }
                });
                input.parent().parent().hide();
                input.blur();
                scroll(0,0);
                return false;
            });
        }
        else
        {
            var input = $('<button class="btn" name="submit"><span class="blue large"><span>Odeslat</span></span></button>');
            div.append(input);
        }
        $(this).append(div);
        if(i != 0)
        {
            $(this).hide();
        }
        
    });
    $('.foto-remove').click(function () {
        if(confirm('Opravdu chcete fotku vymazat ?'))
        {
            if($('#student_id').val())
            {
                var data = 'student_id=' + $('#student_id').val();
            }
            else if($('#ucitel_id').val())
            {
                var data = 'ucitel_id=' + $('#ucitel_id').val();
            }
            var link = $(this);
            link.html('<img src="/images/progress.gif" />');
            $.ajax({type: "GET", url: "/nastaveni/smazat_fotku/", data: data, complete: function(request)            
            {
                if(request.responseText == 'ok')
                {
                    $('#nastaveni-foto').html('<img src="/images/foto.gif" />');
                }
                else
                {
                    alert('Fotku se nepodařilo vymazat.');
                }
                link.html('Vymazat fotku');
            }});
        }
    }); 
    if($('.nastaveni-student').length != 0 || $('.nastaveni-ucitel').length != 0)
    {
        var url = '';
        if($('#student_id').val())
        {
            var url = '/nastaveni/fotka/?student_id=' + $('#student_id').val();
        }
        if($('#ucitel_id').val())
        {
            var url = '/nastaveni/fotka/?ucitel_id=' + $('#ucitel_id').val();
        }
        swfu = new SWFUpload({
            upload_script : url,
            target : "foto-loader-panel",
            flash_path : "/flash/swfupload.swf",
            allowed_filesize : 30720,	// 30 MB
            allowed_filetypes : "*.jpg",
            allowed_filetypes_description : "Fotky...",
            browse_link_innerhtml : _lang['upload_photo'],
            upload_link_innerhtml : "Nahrejte fotku",
            browse_link_class : "",
            upload_link_class : "",
            flash_loaded_callback : 'swfu.flashLoaded',
            //~ upload_file_queued_callback : "fileQueued",
            upload_file_start_callback : 'uploadFileStart',
            upload_progress_callback : 'uploadProgress',
            upload_file_complete_callback : 'uploadComplete',
            upload_error_callback : 'function () {alert("xxxx");}',
            upload_cancel_callback : 'function () {alert("xxxx");}',
            auto_upload : true
        });
    }
    $('a.show-zprava').click(function() {
        var id = $(this).attr('id').split('_')[2];
        $('.list-group-item-text').hide();
        $('#zprava_' + id).toggle().removeClass('hidden');
    });
    $('a.player').each(function(i, el) {
        if(canHtml5Audio())
        {
            var audio = $('<audio></audio>');
            audio.attr('src', $(el).attr('href')).attr('controls', 'controls').attr('preload', 'auto');
            audio.insertAfter(el);
            $(el).remove();
        }
        else
        {
            $(el).flash(
                { src: '/flash/singlemp3player.swf', height: 200, width: 300 },
                { version: 7 },
                function(htmlOptions) {
                    $this = $(this);
                    htmlOptions.flashvars.file = $this.attr('href');
                    $this.html('');
                    $this.before($.fn.flash.transform(htmlOptions));                        
                }
            );
        }
    });
    /*$('a.player').flash(
        { src: '/flash/singlemp3player.swf', height: 200, width: 300 },
        { version: 7 },
        function(htmlOptions) {
            $this = $(this);
            htmlOptions.flashvars.file = $this.attr('href');
            $this.html('');
            $this.before($.fn.flash.transform(htmlOptions));						
        }
    );*/
    $('a.videoplayer').flash(
        { src: '/flash/simpleflvplayer.swf',  bgcolor: "FFFFFF" },
        { version: 7 },
        function(htmlOptions) {
            $this = $(this);
            htmlOptions.flashvars.skin = '/flash/SteelExternalAll.swf';
            htmlOptions.flashvars.url = $this.attr('href');
            htmlOptions.flashvars.AutoPlay = 0;
            
            $this.html('');
            $this.before($.fn.flash.transform(htmlOptions));						
        }
    );
    
    $('#instrukce-nova').click(function() {
        $('#div_test_instrukce').show().removeClass('hidden');
        // if($(this).parent().is('.alert-info'))
        // {
            $(this).parent().hide();
        // }
    });
    bindOtazkaOdpoved();
    bindHighlightable();
    if($('form.priradit_form').length != 0 || $('form.poslat_zpravu_form').length != 0)
    {    
        $('#trida_id').change(function() {

            var selected = new Array();
            var not_continue = false;
            $(this).find(':selected').each(function() {
                if(!not_continue)
                {
                    selected.push($(this).val())
                }
                if($(this).val() == 0)
                {
                    not_continue = true;
                }
            });
            if(not_continue)
            {
                $(this).find(':selected').each(function() {
                    if($(this).val() == 0)
                    {
                        this.selected = 1;
                    }
                    else
                    {
                        this.selected = 0;
                    }
                });
            }
            if(selected.length == 0 || (selected.length == 1 && selected[0] == 0))
            {
                $('#testy_priradit_student_id').hide();
            }
            else
            {
                var params = '';
                for(var i = 0; i < selected.length; i++)
                {
                    params += '&trida_id[]=' + selected[i];
                }
                $.getJSON("/testy/studenti_trid/?" + params, function(json) 
                {   
                    var select = $('#testy_priradit_student_id').find('select').get(0);
                    select.options.length = 0;
                    $.each(json, function(student_id, jmeno) {
                        var option = new Option(jmeno, student_id);
                        if(student_id == 0)
                        {
                            option.selected = 1;
                        }
                        select.options[select.options.length] = option;
                    });
                    console.log('aaaaa');
                    $('#testy_priradit_student_id').removeClass('hidden').show();
                });
            }
        });
    }
    $('#table_checkall').change(function() {
        var table = $(this).parents('table');
        if($(this).prop('checked'))
        {
            $('input.table_checkallable', table).attr('checked', 'checked');
        }
        else
        {
            $('input.table_checkallable', table).removeAttr('checked');
        }
    });
    if($('#testy_priradit').length != 0)
    {    
        $('#department_id').change(function() 
        {
            var selected = new Array();
            var not_continue = false;
            $('option[selected]', $(this)).each(function() 
            {
                if($(this).val() != '')
                {
                    selected.push($(this).val())
                }
            });
            var params = '';
            for(var i = 0; i < selected.length; i++)
            {
                params += '&oddeleni_id[]=' + selected[i];
            }
            $.getJSON("/testy/studenti_oddeleni/?" + params, function(json) 
            {   
                var select = $('#class_id').get(0);
                select.options.length = 0;
                $.each(json, function(trida_id, nazev) {
                    var option = new Option(nazev, trida_id);
                    if(trida_id == '')
                    {
                        option.selected = 1;
                    }
                    select.options[select.options.length] = option;
                });
                $('#class_id').show();
            });
        });
    }
    if($('form.priradit_form').length != 0)
    {
        $('#student_id').change(function() {
            var not_continue = false;
            $(this).find('option[selected]').each(function() {
                if($(this).val() == 0)
                {
                    not_continue = true;
                }
            });
            if(not_continue)
            {
                $(this).find('option[selected]').each(function() {
                    if($(this).val() == 0)
                    {
                        this.selected = 1;
                    }
                    else
                    {
                        this.selected = 0;
                    }
                });
            }
        });
    }
    
    if($('#test-timer').length == 1)
    {
        test_timer  = setTimeout("updateTestTimer()", 1000);
    }
    
    if($('#test_novy, #test_zmena, #test_banka_novy_kategorie').length != 0)
    {
        $('#test_kategorie_id').change(function() {
            if($(this).val() == 9999)
            {
                $('#el_test_kategorie_nazev').show();
            }
            else
            {
                $('#el_test_kategorie_nazev').hide();
            }
        });
        $('#add_default').change(function() {
            if($(this).is(':checked'))
            {
                console.log('disabled');
                console.log($('#default_answer_points'));
                $('#default_answer_points').prop( "disabled", false);
            }
            else
            {
                $('#default_answer_points').prop( "disabled", true);
            }
        });
    }
    if($('form.oddeleni_nove').length != 0)
    {
        $('#ucitel_id').change(function() {
            $(this).val() == 0 ? $('#ucitel').show().removeClass('hidden') : $('#ucitel').hide();
        });
    }
    if($('form.tridy_nova').length != 0)
    {
        $('#ucitel_id').change(function() {
            $(this).val() == 0 ? $('#ucitel').show().removeClass('hidden') : $('#ucitel').hide();
        });
    }
    if($('form.oddeleni_novy_vedouci').length != 0)
    {
        $('#ucitel_id').change(function() {
            $(this).val() == 0 ? $('#ucitel').show().removeClass('hidden') : $('#ucitel').hide();
        });
    }
    if($('form.test_banka_novy').length != 0)
    {
        $('#banka_id').change(function() {
            if($(this).val() != '')
            {
                $.getJSON("/test/testy_banky/?banka_id=" + $(this).val(), function(json) 
                {
                    loadOptions(json, $('#test_id').get(0));
                    $('#el_test_id').show();
                });
            }
            else
            {
                $('#el_test_id').hide();
            }
        });
    }
    var marker = false;
    if($('#firma-zmena-gmap').length != 0)
    {
        gmap = new GMap2(document.getElementById("firma-zmena-gmap"));
        gmap.addControl(new GSmallMapControl());
        gmap.addControl(new GMapTypeControl());
        if($('input[name=lat]').val() != '' && $('input[name=lng]').val() != '')
        {
            var lat = $('input[name=lat]').val();
            var lng = $('input[name=lng]').val()
            var point = new GLatLng(lat, lng);
            gmap.setCenter(point, 13);
            var text = $('input[name=nazev]').val() + "<br />" + 
                       $('input[name=adresa]').val() + ' ' + $('input[name=mesto]').val() + ' ' + $('input[name=psc]').val() + '<br />Email: ' + 
                       $('input[name=email]').val() + '<br />WWW: <a href="' + $('input[name=www]').val() + '" target="_blank">' + 
                       $('input[name=www]').val() + '</a><br />Telefon: ' + 
                       $('input[name=telefon]').val() + '<br />';
            gmap.openInfoWindow(point, text);
        }
        else
        {
            gmap.setCenter(new GLatLng(49.191128, 16.617851), 14);
        }
        
        GEvent.addListener(gmap, "click", function(marker, point) 
        {
            $('input[name=lat]').val(point.lat());
            $('input[name=lng]').val(point.lng());
            gmap.openInfoWindow(point, document.createTextNode($('input[name=nazev]').val()));
        });
    }
    if($('#firma-zmena-gmap').length != 0)
    {
        gmap = new GMap2(document.getElementById("firma-zmena-gmap"));
        gmap.addControl(new GSmallMapControl());
        gmap.addControl(new GMapTypeControl());
        if($('input[name=lat]').val() != '' && $('input[name=lng]').val() != '')
        {
            var lat = $('#lat').val();
            var lng = $('#lng').val()
            var point = new GLatLng(lat, lng);
            gmap.setCenter(point, 13);
            var text = $('input[name=nazev]').val() + "<br />" + 
                       $('input[name=adresa]').val() + ' ' + $('input[name=mesto]').val() + ' ' + $('input[name=psc]').val() + '<br />Email: ' + 
                       $('input[name=email]').val() + '<br />WWW: <a href="' + $('input[name=www]').val() + '" target="_blank">' + 
                       $('input[name=www]').val() + '</a><br />Telefon: ' + 
                       $('input[name=telefon]').val() + '<br />';
            gmap.openInfoWindow(point, text);
        }
        else
        {
            gmap.setCenter(new GLatLng(49.191128, 16.617851), 14);
        }
        
        GEvent.addListener(gmap, "click", function(marker, point) 
        {
            $('#lat').val(point.lat());
            $('#lng').val(point.lng());
            var text = $('input[name=nazev]').val() + "<br />" + 
                       $('input[name=adresa]').val() + ' ' + $('input[name=mesto]').val() + ' ' + $('input[name=psc]').val() + '<br />Email: ' + 
                       $('input[name=email]').val() + '<br />WWW: <a href="' + $('input[name=www]').val() + '" target="_blank">' + 
                       $('input[name=www]').val() + '</a><br />Telefon: ' + 
                       $('input[name=telefon]').val() + '<br />';
            gmap.openInfoWindow(point, text);
        });
    }
    if($('#firma-gmap').length != 0)
    {
        firma_gmap = new GMap2(document.getElementById("firma-gmap"));
        firma_gmap.addControl(new GSmallMapControl());
        if($('input[name=_lat]').val() != '' && $('input[name=_lng]').val() != '')
        {
            var lat = $('input[name=_lat]').val();
            var lng = $('input[name=_lng]').val()
            var point = new GLatLng(lat, lng);
            firma_gmap.setCenter(point, 13);
            firma_gmap.addOverlay(new GMarker(point));
        }
        else
        {
            gmap.setCenter(new GLatLng(49.191128, 16.617851), 13);
        }
    }
    var reftimer = 0;
    if($('#ajaxrefresher').length != 0)
    {
        reftimer  = setTimeout('doRefresh();', 60000);
    }
});


function doRefresh()
{
    $.ajax({type: "GET", url: '/test/refresh/', data: {}, complete: function()
    {
    }});
    reftimer  = setTimeout('doRefresh();', 60000);
}

function loadOptions(data, element)
{
    element.options.length = 0;
    $.each(data, function(id, nazev) {
        var option = new Option(nazev, id);
        element.options[element.options.length] = option;
    });
}

function updateTestTimer()
{
    var element = $('#test-timer');
    if(element.html() == 'neomezeno')
    {
        return;
    }
    var tmp = element.html().split(':');
    var minut = tmp[0];
    var sekund = tmp[1];
    if(sekund == 0)
    {
        sekund = '59';
        minut--;
    }
    else
    {
        sekund -= 1;
    }
    if(minut == -1 && sekund == 59)
    {
        window.onbeforeunload = false;
        $('#test-form').unbind();
        $('#test-form #test-done').click();
        return true;
    }
    if(sekund >= 0 && sekund <= 9)
    {
        sekund = '0' + sekund;
    }
    element.html(minut + ':' + sekund);
    if (typeof testTickDone == 'function') { testTickDone(minut, sekund); }
    test_timer  = setTimeout("updateTestTimer()", 1000);
}

var test_timer = 0;

function bindHighlightable(table)
{
    $('table.highlightable tr').unbind();
    $('table.highlightable tr').mouseover(function() {
        $(this).addClass('highlighted');
    });
    $('table.highlightable tr').mouseout(function() {
        $(this).removeClass('highlighted');
    });
    $('table.highlightable-space tr').unbind();
    $('table.highlightable-space tr').mouseover(function() {
        $(this).addClass('highlighted');
    });
    $('table.highlightable-space tr').mouseout(function() {
        $(this).removeClass('highlighted');
    });
}

function bindOtazkaOdpoved()
{
    if($('form.test_otazka_nova').length != 0 || $('form.test_otazka_zmena').length != 0)
    {
        $('#hint-' + $('#typ').val()).show().removeClass('hidden');
        $('#test_otazka_kategorie_id').change(function() 
        {
            if($(this).val() == 0)
            {
                $('#el_test_otazka_kategorie_nazev').show().removeClass('hidden');
            }
            else
            {
                $('#el_test_otazka_kategorie_nazev').hide();
            }
        });
        $('#typ').change(function() {
            if($(this).val() == 1 || $(this).val() == 10 || $(this).val() == 4 || $(this).val() == 5 || $(this).val() == 6)
            {
                $('#el_test_otazka_text').show().removeClass('hidden');
            }
            else
            {
                $('#el_test_otazka_text').hide();
            }
            if($(this).val() == 4 || $(this).val() == 5 || $(this).val() == 6)
            {
                $('#el_test_otazka_odpoved').hide();
            }
            else
            {
                $('#el_test_otazka_odpoved').show().removeClass('hidden');
            }
            $('.alert').hide();
            $('#hint-' + $(this).val()).show().removeClass('hidden');
        });
    }
}

function formatSizeUnits(bytes)
{
      if      (bytes>=1073741824) {bytes=(bytes/1073741824).toFixed(2)+' GB';}
      else if (bytes>=1048576)    {bytes=(bytes/1048576).toFixed(2)+' MB';}
      else if (bytes>=1024)       {bytes=(bytes/1024).toFixed(2)+' KB';}
      else if (bytes>1)           {bytes=bytes+' bytes';}
      else if (bytes==1)          {bytes=bytes+' byte';}
      else                        {bytes='0 byte';}
      return bytes;
}