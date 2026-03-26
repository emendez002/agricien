$(function () {	
	$.get("/render/prog/tweaco-minicart/Templates.html?language=" + $("meta[http-equiv='Content-Language']").attr('content'), function(html) {
		//$("body").append(html);
		
		/* Config Start */
		var flagQuantity = true;
		var flagPrice = false;
		//var bottonUrl = "/sitepreview/tweaco/en/quote";
		var currencySign;
		var subTotal;
		var shippingLegend;
		var placeOrderButtonText;		
		var dialogMessage;
		var dialogTitle;
		
		if ($("meta[http-equiv='Content-Language']").attr('content') == 'es') {	
			currencySign = '$';
			subTotal = 'MiniCart';
			shippingLegend = 'MiniCart';
			placeOrderButtonText = 'Haga su pedido o cotización';			
			dialogTitle = 'Mensaje';
			dialogMessage = 'El servicio que quiere seleccionar ya fue agregado';
		}

		if ($("meta[http-equiv='Content-Language']").attr('content') == 'en') {
			currencySign = '$';
			subTotal = 'MiniCart';
			shippingLegend = 'MiniCart';
			placeOrderButtonText = 'Haga su pedido o cotización';
			dialogTitle = 'Message';
			dialogMessage = 'The service you want to select is already added';
		}
		
		/* Config End */
		
		var foo = $(processMiniCart (html));
		
		var $head;		
		var $miniCart;
		var $dialog;
		if (flagQuantity && flagPrice) {
			$head = $('#mini-cart-head-all',foo);
			$head.appendTo($('head'));		
			$miniCart = $('#mini-cart-all',foo);			
			$miniCart.appendTo($('body'));			
		}
		else if (!flagQuantity && flagPrice) {
			$head = $('#mini-cart-head-woqty',foo);
			$head.appendTo($('head'));		
			$miniCart = $('#mini-cart-woqty',foo);
			$miniCart.appendTo($('body'));
			
			$dialog = $('#dialogo-exclusividad',foo);		
			$dialog.appendTo($('body'));
		}
		else if (flagQuantity && !flagPrice) {
			$head = $('#mini-cart-head-woprice',foo);
			$head.appendTo($('head'));		
			$miniCart = $('#mini-cart-woprice',foo);
			$miniCart.appendTo($('body'));
		}
		else if (!flagQuantity && !flagPrice) {
			$head = $('#mini-cart-head-woqtyprice',foo);
			$head.appendTo($('head'));		
			$miniCart = $('#mini-cart-woqtyprice',foo);
			$miniCart.appendTo($('body'));
			
			$dialog = $('#dialogo-exclusividad',foo);		
			$dialog.appendTo($('body'));
		}

		TWEACO.apps.MiniCart.Render({ defaultShippingCost: 0, currencySign: currencySign, shippingLegend: shippingLegend, placeOrderButtonText: placeOrderButtonText });
		
		var dialogWidth = 400;
		$('#dialogo-exclusividad').dialog({
			autoOpen: false,
			width: dialogWidth,
			position: [($(window).width() / 2) - (dialogWidth / 2), 200],
			modal: true,
			buttons: {
			Ok: function () {
				$(this).dialog("close");
			}
			}
		});

		$(".WX6OFG-cart").on("click", function (e) {
			var $product = $(e.target);
			
			var aProduct = decodeURI($product.attr('href')).split("|");
			
			if(TWEACO.apps.MiniCart.ProductIsInCart(aProduct[0]) && !flagQuantity) {
			  $('#dialogo-exclusividad').dialog('open');
			  $('#dialogo-exclusividad').parents('.ui-dialog:first').effect("shake", {times: 3}, 80);
		   } else {		
				// Parámetros: Código, Descripción, Precio y Cantidad
				var newCartLine = new TWEACO.apps.MiniCartLine(aProduct[0], aProduct[1], aProduct[2], aProduct[3]);
				TWEACO.apps.MiniCart.AddProduct(newCartLine);
			}

			return false;
		}); 
		
		function processMiniCart (stringToProcess) {
			//stringToProcess = replaceAll("#buttonUrl#", bottonUrl, stringToProcess);
			stringToProcess = replaceAll("#subTotal#", subTotal, stringToProcess);
			stringToProcess = replaceAll("#dialogMessage#", dialogMessage, stringToProcess);
			stringToProcess = replaceAll("#dialogTitle#", dialogTitle, stringToProcess);
			
			return stringToProcess;
		}	
		
		function replaceAll(find, replace, str) 
		{
			while( str.indexOf(find) > -1)
			{
				str = str.replace(find, replace);
			}
			return str;
		}		
	});
});