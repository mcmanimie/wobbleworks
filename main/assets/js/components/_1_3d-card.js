// File#: _1_3d-card
// Usage: codyhouse.co/license
(function() {
  var TdCard = function(element) {
    this.element = element;
    this.maxRotation = parseInt(this.element.getAttribute('data-rotation')) || 2; // rotation max value
    this.perspective = this.element.getAttribute('data-perspective') || '300px'; // perspective value
    this.rotateX = 0;
    this.rotateY = 0;
    this.partRotateX = 0;
    this.partRotateY = 0;
    this.deltaRotation = 0.3;
    this.animating = false;
    initTdEvents(this);
  };

  function initTdEvents(tdCard) {
    // detect mouse hovering over the card
    tdCard.element.addEventListener('mousemove', function(event){
      if(tdCard.animating) return;
      tdCard.animating = window.requestAnimationFrame(moveCard.bind(tdCard, event, false));
    });

    // detect mouse leaving the card
    tdCard.element.addEventListener('mouseleave', function(event){
      if(tdCard.animating) window.cancelAnimationFrame(tdCard.animating);
      tdCard.animating = window.requestAnimationFrame(moveCard.bind(tdCard, event, true));
    });
  };

  function moveCard(event, leaving) {
    // get final rotation values
    setRotationLevel(this, event, leaving);

    // update rotation values
    updateRotationLevel(this);
  };

  function setRotationLevel(tdCard, event, leaving) {
    if(leaving) {
      tdCard.rotateX = 0;
      tdCard.rotateY = 0;
      return;
    }

    var wrapperPosition = tdCard.element.getBoundingClientRect();
    var rotateY = 2*(tdCard.maxRotation/wrapperPosition.width)*(event.clientX - wrapperPosition.left - wrapperPosition.width/2);
    var rotateX = 2*(tdCard.maxRotation/wrapperPosition.height)*(wrapperPosition.top - event.clientY + wrapperPosition.height/2);

    if(rotateY > tdCard.maxRotation) rotateY = tdCard.maxRotation;
    if(rotateY < -1*tdCard.maxRotation) rotateY = -tdCard.maxRotation;
    if(rotateX > tdCard.maxRotation) rotateX = tdCard.maxRotation;
    if(rotateX < -1*tdCard.maxRotation) rotateX = -tdCard.maxRotation;

    tdCard.rotateX = rotateX;
    tdCard.rotateY = rotateY;
  };

  function updateRotationLevel(tdCard) {
    if( (tdCard.partRotateX == tdCard.rotateX) && (tdCard.partRotateY == tdCard.rotateY)) {
      tdCard.animating = false;
      return;
    }

    tdCard.partRotateX = getPartRotation(tdCard.partRotateX, tdCard.rotateX, tdCard.deltaRotation);
    tdCard.partRotateY = getPartRotation(tdCard.partRotateY, tdCard.rotateY, tdCard.deltaRotation);
    // set partial rotation
    rotateCard(tdCard);
    // keep rotating the card
    tdCard.animating = window.requestAnimationFrame(function(){
      updateRotationLevel(tdCard);
    });
  };

  function getPartRotation(start, end, delta) {
    if(start == end) return end;
    var newVal = start;
    if(start < end) {
      newVal = start + delta;
      if(newVal > end) newVal = end;
    } else if(start > end) {
      newVal = start - delta;
      if(newVal < end) newVal = end;
    }
    return newVal;
  }

  function rotateCard(tdCard) {
    tdCard.element.style.transform = 'perspective('+tdCard.perspective+') rotateX('+tdCard.partRotateX+'deg) rotateY('+tdCard.partRotateY+'deg)';
  };

  window.TdCard = TdCard;

  //initialize the TdCard objects
  var tdCards = document.getElementsByClassName('js-td-card');
  if( tdCards.length > 0 && Util.cssSupports('transform', 'translateZ(0px)')) {
    for( var i = 0; i < tdCards.length; i++) {
      (function(i){
        new TdCard(tdCards[i]);
      })(i);
    }
  };
}());
