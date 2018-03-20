
  // Toggle the side navigation
  $("#sidenavToggler").click(function(e) {
    e.preventDefault();
    $("body").toggleClass("sidenav-toggled");
    $(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
    $(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");
  });

  // Force the toggled class to be removed when a collapsible nav link is clicked
  $(".navbar-sidenav .nav-link-collapse").click(function(e) {
    e.preventDefault();
    $("body").removeClass("sidenav-toggled");
  });


var MALL = '';
var chageMall=true;

function baseUrl(v){
	var result = "";
	switch (v) {
		case 'SSG_PC':
			result = "http://svn.ssgadm.com/ssgui/01.ssg/pcweb/trunk";
			break;
		case 'SSG_M':
			result = "http://svn.ssgadm.com/ssgui/01.ssg/mobile/trunk";
			break;
	}
	return result;
}

function fb_set(fd,vtitle,vlink,vstate,el,vdesc) {
	var elTitle = $('#'+ vtitle);
	var vDate = vtitle.split('-')[0];
	var postData = '';
	if ($(el).hasClass('btn_done') == true){
		postData = {
			link : $('#'+ vlink).val(),
			state : $('#'+ vstate).prop('checked'),
			date : parseInt(vDate,10),
			desc : $('#'+ vdesc).val()
		};
	}else{
		postData = {
			link : $('#'+ vlink).val(),
			state : $('#'+ vstate).prop('checked'),
			date : new Date().getTime(),
			desc : $('#'+ vdesc).val()
		};
	}

	if ($('#'+ vtitle).val() == '' ){
		alert('타이틀?');
		$('#'+ vtitle).focus();
		return false;
	}else if ($('#'+ vlink).val() == ''){
		alert('SVN 링크?');
		$('#'+ vlink).focus();
		return false;
	}else{
		var newPostKey = firebase.database().ref().child('posts').push().key;

		var updates = {};

		var li_tag = '';
		var li_ico = '';
		var li_state = '';

		if (postData.state == false){
			li_ico = ' fa-exclamation-triangle';
			li_state = 'fd_temp';
		}else{
			li_ico = ' fa-caret-right';
			li_state = '';
		}
		var descTit = (postData.desc == undefined) ? '' : postData.desc;

		li_tag += '<li class="fd_li column '+li_state+'" data-num="'+postData.date+'"><i class="fa'+li_ico+' handle"></i> <a class="svn" href="'+postData.link+'" target="ifr" title="'+descTit+'" data-toggle="tooltip">'+ $('#'+ vtitle).val() +'<span class="link">'+postData.link+'</span></a><div class="btn_area"><button data-key="'+fd+'" data-key1="'+$('#'+ vtitle).val()+'" class="btn_del fa fa-trash"></button><button data-key="'+fd+'" data-key1="'+$('#'+ vtitle).val()+'" class="btn_edit fa fa-pencil-square-o"></button></div></li>';

		if ($(el).hasClass('btn_done') == true){
			$(el).parent().parent()[0].outerHTML = li_tag;
			firebase.database().ref('/'+MALL+'/'+fd+'/').child($(el).data('key1')).remove().then(function() {

			}).catch(function(error) {
				alert('error');
			});
		}else{
			$(el).parent().parent().prev('ul').append(li_tag);
		}

		updates['/'+MALL+'/'+fd+'/'+ elTitle.val()] = postData;

		$('#'+ vlink).val('');
		$('#'+ vtitle).val('').focus();

		init();
		return firebase.database().ref().update(updates);
	}
}

function callList(){
	$('#nav').html('');
  $('#nav_location').html('');
	$('#loading').show();
	firebase.database().ref('/'+MALL).on("child_added", function(snapshot) {
		var titKey = snapshot.key.split('-');
		var h2_tag = '<h2 class="sec_h"><i class="fa fa-folder"></i><span class="tt"> '+titKey[1]+'</span><button class="btn_set" onclick="fnSet(this)"><i class="fa fa-cog" aria-hidden="true"></i></button></h2>';
    var titLoct = '<a href="javascript:void(0)"><span>'+titKey[1]+'</span></a>';
		var div_add = '<div class="add_list form-group">'+
			'<div class="form-group "><input placeholder="타이틀" id="ip1_'+snapshot.key+'" class="form-control small" /></div>'+
			'<div class="form-group "><input placeholder="SVN 링크" id="ip2_'+snapshot.key+'" class="form-control" /></div>'+
			'<div class="form-group "><input placeholder="설명" id="ip3_'+snapshot.key+'" class="form-control" /></div>'+
			'<div class="form-check"><label class="form-check-label"> <input type="checkbox" class="form-check-input" id="chk1_'+snapshot.key+'" checked="checked">노출</label></div>'+
			'<div class="form-group "><button type="submit" onclick="fb_set(\''+snapshot.key+'\',\'ip1_'+snapshot.key+'\',\'ip2_'+snapshot.key+'\',\'chk1_'+snapshot.key+'\',this,\'ip3_'+snapshot.key+'\')" class="btn btn-primary btn-md btn_submit">완료</button></div>'+
			'</div>';
		var li_tag = '';
		var li_state = '';
		var li_ico = '';

		firebase.database().ref('/'+MALL+'/'+snapshot.key).orderByChild('date').on("child_added", function(snapshot1) {
			if (snapshot1.val().state == false){
				li_ico = ' fa-exclamation-triangle';
				li_state = 'fd_temp';
			}else{
				li_ico = ' fa-caret-right';
				li_state = '';
			}

			var websvn = snapshot1.val().link;
			var websvnUrl =''
			var descTit = (snapshot1.val().desc == undefined) ? '' : snapshot1.val().desc;
			var websvnUrl = (websvn ==  undefined) ? '' : websvn.replace('/ssgui/','/websvn/log.php?repname=S.com+UI+Repository&path=/');
			if (snapshot1.key != 'temp'){
				li_tag += '<li class="fd_li column '+li_state+'" data-num="'+snapshot1.val().date+'"><i class="fa'+li_ico+' handle"></i> <a class="svn" href="'+snapshot1.val().link+'" target="ifr" title="'+descTit+'" data-toggle="tooltip">'+ snapshot1.key +'<span class="link">'+snapshot1.val().link+'</span></a><span class="util_btn"><i class="fa fa-external-link"></i><a class="fa fa-code" target="websvn" href="'+websvnUrl+'"></a></span><div class="btn_area"><button data-key="'+snapshot.key+'" data-key1="'+snapshot1.key+'" class="btn_del fa fa-trash"></button><button data-key="'+snapshot.key+'" data-key1="'+snapshot1.key+'" class="btn_edit fa fa-pencil-square-o"></button></div><div class="btn_area2"><button data-key="'+snapshot.key+'" data-key1="'+snapshot1.key+'" class="btn_done fa fa-check"></button></div>'

				+'<div class="edit_form">'
				+'<input type="checkbox" class="chk" id="'+snapshot1.val().date+'_chk" checked="checked">'
				+'<input type="text" class="ip_tit" id="'+snapshot1.val().date+'_1" value="'+snapshot1.key+'">'
				+'<input type="text" class="ip_link" id="'+snapshot1.val().date+'_2" value="'+snapshot1.val().link+'">'
				+'<input type="text" class="ip_desc" id="'+snapshot1.val().date+'_3" value="'+descTit+'">'
				+'</div>'
				+'</li>';

			}

		});
		var ul_tag = '<ul class="fd_ul">'+li_tag+'</ul>';
		$('#loading').hide();
		$('#nav').append(h2_tag + ul_tag + div_add );
    $('#nav_location').append(titLoct);
		init();
	});
}

function editChk(){
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			$('#mainNav').addClass('ui');
			$('#btnLogin').hide();
			$('#btnLogout').show();
		} else {
			$('#mainNav').removeClass('ui');
			$('#btnLogin').show();
			$('#btnLogout').hide();
		}
	});
}

function fnSet(e){
	var elem = $(e);
	var sortList = elem.parent().next('.fd_ul');

	if (elem.find('.fa').hasClass('fa-dot-circle-o') == true){
		callList();
		$(document).on('keydown',function(e) {
			$listWrap = $('#nav');
			$list = $listWrap.find('.fd_li');
			switch(e.which) {
				case 38:
					$list.eq( ($list.index($listWrap.find('.atv'))) - 1 ).find('a.svn').trigger('click');
					break;
				case 40:
					$list.eq( ($list.index($listWrap.find('.atv'))) + 1 ).find('a.svn').trigger('click');
					break;
				default:
					return
			}
			e.preventDefault();
		});
	}else{
		sortList.sortable('enable');
		elem.find('.fa').attr('class','fa fa-dot-circle-o');
		sortList.addClass('fd_ul_edit');
		sortList.find('.handle').attr('class','fa fa-sort handle');
		$(document).off('keydown');
	}

	sortList.sortable({
		handle: '.handle'
	}).bind('sortupdate', function(e,current) {
		var currentElem = current.item;
		var prevNum ,nextNum , currentNum = '';

		prevNum = currentElem.prev().data('num');
		nextNum = currentElem.next().data('num');
		if (prevNum == undefined){
			currentNum = parseInt(nextNum,10) - 1;
		}else if (nextNum == undefined){
			currentNum = parseInt(prevNum,10) + 1;
		}else {
			currentNum = parseInt(prevNum,10) + (parseInt(nextNum,10) - parseInt(prevNum,10)) / 2 ;
		}

		currentElem.attr('data-num',currentNum);

		var updates = firebase.database().ref('/'+MALL+'/'+currentElem.find('.btn_del').data('key')+'/'+currentElem.find('.btn_del').data('key1'));
		updates.update({ 'date': parseInt(currentNum,10) });

	});
}

$('body').on('click','.add_li',function() {
	$(this).next('.add_list').toggle();
}).on('click','a.svn', function(e) {
	if ($(this).parent().hasClass('atv') == true){
		window.open($(this).attr('href'), 'index');
	}else{
		$('#ifr').attr('src', $(this).attr('href'));
	}
	$('.fd_li').removeClass('atv');
	$(this).parent().addClass('atv');
});

$('body').on('click','.sec_h > .fa',function() {
	$(this).parent().next('.fd_ul').toggle();
});

$('body').on('click','.sec_h > span.tt',function() {
	$('.fd_ul').hide();
});

$('body').on('click','.btn_del',function(){
	var _this = $(this);
	var _key = _this.data("key").split('-');
	var _key1 = _this.data("key1");
	var r = confirm('"'+_key[1] + '->' +_key1 +'" 항목을\n삭제 하시겠습니까?');
	if (r == true) {
		firebase.database().ref('/'+MALL+'/'+_key[0]+'-'+_key[1]+'/').child(_key1).remove().then(function() {
			_this.parent().parent().remove();
		}).catch(function(error) {
			alert('권한확인 요청 (IT 개발2팀 황성철P)');
		});
	}else {
		return false;
	}
});

$('body').on('click','.btn_edit',function(){
	var _this = $(this);
	var _key = _this.data("key").split('-');
	var _key1 = _this.data("key1");
	var r = confirm('"'+_key[1] + '->' +_key1 +'" 항목을\n수정 하시겠습니까?');
	if (r == true) {
		_this.parents('.fd_li').addClass('fd_li_edit');
		//fb_set(_this.data("key"),vtitle,vlink,vstate,el)
	}else {
		return false;
	}
});

$('body').on('click','.btn_done',function(e){
	var _this = $(this);
	var numId = _this.parent().parent().data('num');
	fb_set(_this.data("key"),numId+'_1',numId+'_2',numId+'_chk',this,numId+'_3')
});

$('body').on('click','.ip_link , .ip_tit , .ip_desc',function(e){
	$(this).select();
});

function init(){
	$('[data-toggle="tooltip"]').tooltip();
}


$(document).on('keydown',function(e) {
	$listWrap = $('#nav');
	$list = $listWrap.find('.fd_li');
	switch(e.which) {
		case 38:
			$list.eq( ($list.index($listWrap.find('.atv'))) - 1 ).find('a.svn').trigger('click');
			break;
		case 40:
			$list.eq( ($list.index($listWrap.find('.atv'))) + 1 ).find('a.svn').trigger('click');
			break;
		default:
			return
	}
	e.preventDefault();
});

$(window).on('hashchange', function () {
	var hash = (location.hash == '') ? 'SSG_PC':location.hash.replace( /^#/, '');
	MALL = hash;
	callList(hash);
  $("#nav").animate({ scrollTop: 0 }, 0);
  arrTitTop = [];
  chageMall = true;
	var svnView = $('#svn_view');
	$('#mall').text(MALL);
	$('#ifr').attr('src','about:blank');
	if (location.hash == '#SSG_M' || location.hash == '#BT_M' || location.hash == '#EM_M' || location.hash == '#HWD_M' || location.hash == '#SIV_M' || location.hash == '#SMD_M' || location.hash == '#TV_M' ){
		svnView.addClass('m_portrait');
	}else{
		svnView.removeClass('m_portrait');
	}
}).trigger('hashchange');

$(window).on('load',function() {
	editChk();
});

$('#btnRotate').on('click',function(){
	var svnView = $('#svn_view');
	svnView.toggleClass('m_portrait').toggleClass('m_landscape');
});

$('#btnLogin').on('click',function(){
	var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithPopup(provider).then(function(result) {
	}).catch(function(error) {
		alert(error.message)
	});
});

$('#btnLogout').on('click',function(){
	firebase.auth().signOut().then(function() {
		alert("로그아웃");
	}, function(error) {
		alert(error.message);
	});
});

$('#toTop').on('click',function(){
	$("#nav").animate({ scrollTop: 0 }, 200);
	return false;
});

var arrTitTop = [];
$('#nav_location').on('click','a',function(){
  if (chageMall == true){
    var $secH = $('.sec_h');
    $secH.each(function(index) {
      var $this = $(this);
      arrTitTop.push( $this.offset().top );
    });
    chageMall = false;
  }

  var $this = $(this);
  var posIndex;
  posIndex = $this.index();
  var rtop = parseInt (arrTitTop[posIndex],10);
  $this.addClass('on').siblings().removeClass('on');
  $("#nav").animate({ scrollTop: rtop}, 200);

});

$('#nav_locationBtn').on('click',function(){
  $('#nav_location').fadeToggle();
});
