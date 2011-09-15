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
	
	$("#scrollToTop").click(function(){
		$("#scroll7").scrollbar("scrollTo", 0);
	});
	
	$("#scrollTo30px50px").click(function(){
		$("#scroll7").scrollbar("scrollTo", 50, 30);
	});
	
	$("#scrollToP2").click(function(){
		$("#scroll7").scrollbar("scrollTo", "#p2");
	});
	
	$("#scrollToP3").click(function(){
		$("#scroll7").scrollbar("scrollTo", $("#scroll7 #p3"));
	});
	
});