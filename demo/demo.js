$(function(){
	
	$("#scroll1").scrollbar();
	
	$("#scroll2").scrollbar();
	
	$("#scroll3").scrollbar({
		overlay: false,
		autohide: false
	});
	
	$("#scroll4").scrollbar({
		scroll: false,
		overlay: false,
		autohide: false
	});
	
	$("#scroll5").scrollbar({
		overlay: false,
		autohide: true,
		animate: false
	});
	
	$("#scroll6").scrollbar({
		classes: 'ui-scrollbar-styled',
		overlay: false,
		autohide: false
	});
	
	$("#scroll7").scrollbar();
	
});