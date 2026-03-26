const accordionItemHeaders = document.querySelectorAll(".accordion-item-header");

accordionItemHeaders.forEach(accordionItemHeader => {
  accordionItemHeader.addEventListener("click", event => {
    
    // Uncomment in case you only want to allow for the display of only one collapsed item at a time!
    
    // const currentlyActiveAccordionItemHeader = document.querySelector(".accordion-item-header.active");
    // if(currentlyActiveAccordionItemHeader && currentlyActiveAccordionItemHeader!==accordionItemHeader) {
    //   currentlyActiveAccordionItemHeader.classList.toggle("active");
    //   currentlyActiveAccordionItemHeader.nextElementSibling.style.maxHeight = 0;
    // }

    accordionItemHeader.classList.toggle("active");
    const accordionItemBody = accordionItemHeader.nextElementSibling;
    if(accordionItemHeader.classList.contains("active")) {
      accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
    }
    else {
      accordionItemBody.style.maxHeight = 0;
    }
    
  });
});
var posicionmenu={"position":'fixed', "z-index": '999',"width": '100%',};
var menuoriginal={"position":'relative', "z-index": '999',};
var tamañomenueditado={"right": '30%',"height": '140px',"padding": '0px',"margin": '0px',"padding-top": '50px',}
var tamañomenuoriginal={"right": '30%',"height": '180px',"padding": '0px',"margin": '0px',"padding-top": '67px',}
var logoeditado={"padding": '25px 0px 0px 25px',}
var logoriginal={"padding": '48px 0px 0px 25px',}
$(function(){
  $(window).scroll(function(){
    if ($(this).scrollTop() > 100) {
      console.log('Hola scroll');
      $(".main-nav-wrapper").css(posicionmenu);
      $(".navmenu-h").css(tamañomenueditado);
      $("#id-398").css(logoeditado);
    } else{console.log('no scroll');
    $(".main-nav-wrapper").css(menuoriginal);
    $(".navmenu-h").css(tamañomenuoriginal);
    $("#id-398").css(logoriginal);
    }
  });
});

$('#slider').nivoSlider({ 
    animSpeed: 500,
    pauseTime: 9000,
    effect: 'fade',  
    directionNav: true,
    customChange: function(){Cufon.replace('.nivo-caption');}
});