function KUIContent(content)
{
    $('.tabs', content).tabs();
    $('table.table tr', content).hover(function() {
        $(this).addClass('hover');
    }, function() {
        $(this).removeClass('hover');
    }).click(function() {
        $('a.primary', $(this)).click();
        return false;
    });
	$('table.table a:not(.primary)', content).click(function(e) {
		e.stopPropagation();
	});
}

function url_decode(utftext) {
    utftext = unescape(utftext);
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }
    return string;
}

KUITable = function (el, api_source, options, action)
{
	var _this = this;
	var opts = {
		'cols': {},                 // seznam vsech sloupecku tabulky
		'api_params': {},           // pridane parametry do API
		'limit': 20,                // pocet zaznamu na stranku
		'from': 0,                  // pocatecni index
		'nofirstlock': false,       // pri prvnim loadu stranky nezamykej tabulku
		'table_style': false,       // styl tabulky
		'filter': false,            // filtr tabulky
		'actions': [],              // akce pro radek
		'group_actions': [],        // hromadne akce nad radeky
		'show_onempty': false,      // zobrazit pri zadnem vysledku
		'check_hash': true,         // kontrolovat zmenu url
		'lang_showing': 'zobrazuji',// kontrolovat zmenu url
		'lang_total_from': 'celkem z'// kontrolovat zmenu url
	};
	opts = $.extend(opts, options);
	var api_source = api_source;
	var ttable = $('<table' + (opts.table_style ? ' style="' + opts.table_style + '"' : '') + '></table>').addClass('table table-striped table-hover table-ui');
	this.el = el;
	var thead = $('<thead></thead>');
	var header = $('<tr></tr>');
	thead.append(header);
	this.action = action;
	var footer = $('<tr></tr>');
	var lock = false;
	var filter = false;
	var nofirstlock = 0;
    var hash = '';
    var hashTimer = setTimeout(function() { 
            checkHash();
        }, 100);
	
	filter = opts.filter;
    
    var checkHash = function()
    {
        if(opts.check_hash && hash != window.location.hash)
        {
            hash = window.location.hash;
            var tmp = window.location.hash.substr(1).split('&');
            var hvalues = {}
            $.each(tmp, function(i, tuple) 
            {
                var kv = tuple.split('=');
                hvalues[kv[0]] = kv[1];
                if(kv[0] == 'from')
                {
                    opts.from = parseInt(kv[1]);
                }
                if(kv[0] == 'limit')
                {
                    opts.limit = parseInt(kv[1]);
                }
                
            });
            $(':input', filter).each(function(i, input) 
            {
                input = $(input);
                if(hvalues[input.attr('name')])
                {
                    input.val(url_decode(hvalues[input.attr('name')]));
                    //~ input.val(hvalues[input.attr('name')]);
                }
                else
                {
                    input.val('');
                }
                opts.api_params[input.attr('name')] = input.val();
            });
            
            reload();
        }
        hashTimer = setTimeout(function() { checkHash(); }, 100);
    }
    
    var updateHash = function(reload)
    {
        hash = filter.serialize();
        opts.from = 0;
        window.location.hash = hash;
        if(reload)
        {
            
        }
    }
	
	var bindFilter = function()
	{
		if(filter)
		{
			filter = $(filter);
			if(filter.length == 0)
			{
				return false;
			}
			$(':input', filter).each(function(i, input) 
			{
				input = $(input);
				opts.api_params[input.attr('name')] = input.val();
			});
            
			filter.submit(function() 
			{
                updateHash(true);
                return false;
			});
		}
	}
	
	var create = function()
	{
		_this.el.append(ttable);
        var checkLast = opts.actions.length == 0;
        if(opts.group_actions.length > 0)
        {
            var checkall = $('<input type="checkbox" />');
            checkall.click(function(e) {
                if($(this).is('[checked]'))
                {
                    $('input[type=checkbox][name=rowcheck]', ttable).attr('checked', 'checked');
                }
                else
                {
                    $('input[type=checkbox][name=rowcheck]', ttable).removeAttr('checked');
                }
                e.stopPropagation();
            });
            var th = $('<th />');
            th.append(checkall);
            header.append(th);
        }
		$.each(opts.cols, function(i, col) 
		{
			var th = $('<th></th>');
			if(checkLast && i == opts.cols.length - 1)
			{
				th.addClass('text-right');
			}
			else if(i != 0)
			{
				th.addClass('text-center');
			}
            if(col)
            {
                th.append(col.title);
            }
			header.append(th);
		});
        if(opts.actions.length > 0)
        {
            header.append('<th>&nbsp;</th>');
        }
        
		ttable.append(thead);
		for(var i = 0; i < opts.limit; i++)
		{
			ttable.append('<tr><td colspan="' + opts.cols.length + '">&nbsp;</td></tr>');
		}
		bindFilter();
	}
	
	var getFormated = function(data, format)
	{
		if(format == 'time')
		{
			var tmp = data.split(' ');
			var dtmp = tmp[0].split('-');
			return dtmp[2] + '.' + dtmp[1] + '.' + dtmp[0] + ' ' + tmp[1];
		}
		else if(format == 'date')
		{
			if(data.length == 19)
			{
				var tmp = data.split(' ');
				data = tmp[0];
			}
			var dtmp = data.split('-');
			return dtmp[2] + '.' + dtmp[1] + '.' + dtmp[0];
		}
		else if(format == 'yesno')
		{
			if(data == 1)
			{
				return '<img src="/images/icons/ok.png" alt="ano" />';
			}
			return '<img src="/images/icons/no.png" alt="ne" />';
		}
	}
	
	var getColValue = function(item, col)
	{
		var result = '';
        var name = col['name'];
        if($.isFunction(name))
        {
            return name.call(this, item);
        }
		var tmp1 = name.split('+');
		$.each(tmp1, function(i, p)
		{
			var value = item;
			var tmp2 = p.split('/');
			if(tmp2.length == 1 && p.substr(0, 1) == '"' && p.substr(-1) == '"')
			{
				value = p.substr(1, p.length - 2);
			}
			else
			{
				$.each(tmp2, function(i, sp) 
				{
					var format = false;
					if(i == tmp2.length - 1)
					{
						var tmp3 = sp.split('|');
						if(tmp3.length == 2)
						{
							sp = tmp3[0];
							format = tmp3[1];
						}
					}
                    if(value[sp])
                    {
                        value = value[sp];
                    }
                    else
                    {
                        value = '';
                    }
					if(format != false)
					{
						value = getFormated(value, format);
					}
				});
			}
			result += value;
		});
        if(col['suffix'])
        {
            result += col['suffix'];
        }
		return result;
	}
	
	var addRow = function(data) 
	{
		var tr = $('<tr></tr>');
        if(opts.group_actions.length > 0)
        {
            var checkbox = $('<input type="checkbox" name="rowcheck" value="' + data['id'] + '" />');
            checkbox.click(function(e) { e.stopPropagation(); });
            var td = $('<td />');
            td.append(checkbox);
            tr.append(td);
        }
        var checkLast = opts.actions.length == 0;
		$.each(opts.cols, function(i, col) 
		{
			var td = $('<td></td>');
			if(checkLast && i == opts.cols.length - 1)
			{
				td.addClass('text-right');
			}
			else if(i != 0)
			{
				td.addClass('text-center');
			}
            if(col)
            {
                var value = getColValue(data, col);
                if(col['format'])
                {
                    value = getFormated(value, col['format']);
                }
                td.append(value);
            }
			
			tr.append(td);
		});
        if(opts.actions.length > 0)
        {
            var td = $('<td class="text-right"></td>');
            $.each(opts.actions, function(i, action) 
            {
                if(action)
                {
                    var a = $('<a href="' + (action['href'] ? action['href'] + data['id'] : '#') + '">' + action.title + '</a>');
                    a.click(function(evt) { evt.stopPropagation(); return action.action.call(this, data); });
                    td.append(a);
                }
                
            });
            tr.append(td);
        }
		tr.hover(function() 
		{
			$(this).addClass('hover');
		}, function() 
		{
			$(this).removeClass('hover');
		}).click(function(evt) 
		{
			action.call(this, _this, data.id, evt.metaKey);
		}).mouseup(function(evt) 
		{
            if(evt.button == 1)
            {
                action.call(this, _this, data.id, 1);
            }
		});
		ttable.append(tr);
	}
	
	var addFooter = function(count, count_total)
	{   
        var colspan = opts.cols.length;
        if(opts.actions.length > 0)
        {
            colspan++;
        }
        if(opts.group_actions.length > 0)
        {
            colspan++;
        }
        if(opts.group_actions.length > 0)
        {
            var group_actions_wrap = $('<tr><td>&nbsp;</td></tr>');
            var group_actions = $('<td></td>').attr('colspan', colspan - 1);
            group_actions_wrap.append(group_actions);
            ttable.append(group_actions_wrap);
            var select = $('<select><option value="" selected="selected">zvolte...</option></select>');
            group_actions.append(select);
            $.each(opts.group_actions, function(i, action) {
                var option = $('<option value="' + (i + 1) +'">' + action['title'] + '</option>');
                select.append(option);
                select.change(function() 
                {
                    if($(this).val() == i + 1)
                    {
                        var ids = new Array();
                        $.each($('input[type=checkbox][checked][name=rowcheck]', ttable), function(i, input) {
                            ids.push(input.value);
                        });
                        action.action.call(this, ids);
                    }
                });
            });
        }
        
        var ffooter = $('<tfoot></tfoot>');
		footer = $('<tr></tr>');
		ffooter.append(footer);
        
		var to = opts.from + 1 * opts.limit;
		if(to > count_total)
		{
			to = count_total;
		}
		var from = count > 0 ? (opts.from + 1) : 0;
        
		var td = $('<td colspan="' + colspan + '" class="kui-table-footer"></td>');
		footer.append(td);
		
		var prevnext = $('<ul class="pager"></span>')
		prevnext.append('<li>' + opts.lang_showing + ' ' + from + ' - ' + to + ' ' + opts.lang_total_from + ' ' + count_total + '</li>');
		if(opts.from > 0)
		{
			var prev = $('<li class="previous"><a href="#"><span class="glyphicon glyphicon-arrow-left"></span></a></li>');
			prevnext.append(prev);
			prev.click(function() 
			{
                
                from = opts.from - opts.limit;
                if(from < 0)
				{
                    from = 0;
				}
                hash = window.location.hash;
                hash = hash.replace(/&from=\d+/g, "");
                window.location.hash = hash + '&from=' + from;
                
				return false;
			});
		}
		if(opts.from + 1 * opts.limit < count_total)
		{
			var next = $('<li class="next"><a href="#"><span class="glyphicon glyphicon-arrow-right"></span></a></li>');
			prevnext.append(next);
			next.click(function() 
			{
				if(opts.from + opts.limit < count_total)
				{
					from = opts.from + opts.limit;
                    hash = window.location.hash;
                    hash = hash.replace(/&from=\d+/g, "");
                    window.location.hash = hash + '&from=' + from;
					//~ _this.reload();
				}
				return false;
			});
		}
		td.append(prevnext);
		
		ttable.append(ffooter);
	}
	
	var unlockTable = function()
	{
		if(lock)
		{
			lock.remove();
			lock = false;
		}
	}
	
	var lockTable = function()
	{
		if(!lock)
		{
			var towrap = ttable;
			var offset = towrap.offset();
			var height = towrap.outerHeight();
			var width = towrap.outerWidth();
			lock = $('<div />').css({'position': 'absolute', 'top': offset.top, 'left': offset.left, 'width': width, 'height': height, 'z-index': 1000});
			var shadow = $('<div />').css({'width': towrap.outerWidth(), 'height': towrap.outerHeight(), 'background-color': '#CCC', 'opacity': 0.7});
			
			var loader = $('<div />').css({'background-color': 'white', 'border': '2px solid #CCC', 'padding': '10px', 'width': '100px', 'margin': '0 auto', 'text-align': 'center', 'z-index': 10000, 'position': 'absolute'});
			
			loader.append('<p style="color:#5F7F96;font-weight:bold;margin-bottom:1em;">nahrávám...</p>');
			loader.append('<img src="/images/loader.gif" />');
			var loadertop = height / 2 - (loader.outerHeight() + 80) / 2;
			var loaderleft = width / 2 - (loader.outerHeight() + 80) / 2;
			loader.css({'top': loadertop, 'left': loaderleft});
			
			lock.append(loader);
			
			lock.append(shadow);
			if(towrap.is(':visible'))
			{
				$('body').append(lock);
			}
		}
	}
    
    this.lockTable = function()
	{
		lockTable();
	}
	
	var load = function(quiet)
	{
		if(nofirstlock == 1 || quiet == 1)
		{
			nofirstlock = 0;
		}
		else
		{
			lockTable();
		}
		var tmp = api_source.split('/');
		var object = tmp[1];
		var action = tmp[2];
		var params = opts.api_params;
		params = $.extend(params, {'limit': opts.limit, 'from': opts.from});
		api(object, action, opts.api_params, function(response) 
		{
			if(response['result'])
			{
				$('tr', ttable).slice(1).remove();
				$.each(response['data'], function(id, row) 
				{
					addRow(row);
				});
                if(response['count_total'] > 0)
                {
                    addFooter(response['count'], response['count_total']);
                    if(opts.show_onnotempty)
                    {
                        $(opts.show_onnotempty).show();
                    }
                }
                else if(!filter)
                {
                    if(opts.show_onempty)
                    {
                        $(opts.show_onempty).show();
                    }
                    ttable.remove();
                }
                
			}
			else
			{
				alert(response.data.msg)
			}
			unlockTable();
		});
        $('input[type=checkbox]', header).removeAttr('checked');
		
	}
    
    var reload = function(quiet)
	{
        load(quiet);
    }
	
	this.reload = function(quiet)
	{
		reload(quiet);
	}
	
	if(opts.nofirstlock)
	{
		nofirstlock = 1;
	}
	create();
	load();
}

function redirect(url)
{
    window.location = url;
}

function specialKey(evt)
{
    var code = evt.keyCode;
    if(code == 9 || code == 16 || code == 17 || code == 18 || code == 144 || code == 20 || code == 145 || code == 27 || code == 19 || code == 91 || code == 92 || code == 93 || code == 116 || code == 37 || code == 38 || code == 39 || code == 40)
    {
        return true;
    }
    return false;
}

function sklonujSlovo(stem, p1, p2, p3, count, prepend_count)
{
    if(prepend_count)
    {
        stem = count + ' ' + stem;
    }
    if(count >= 5 || count == 0)
    {
        return stem += p3;
    }
    if(count >= 2)
    {
        return stem += p2;
    }
    return stem += p2;
}