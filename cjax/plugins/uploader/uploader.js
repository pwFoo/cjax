/**
 * Plugin //@uploader;
 * @author cj
 */

function uploader(settings)
{
	console.log('uploader');
	this.callback(false);
	
	var handler,version;
	//backward compatibility with pre-5.3
	version = CJAX.version.replace(/[^0-9\.].*/,'');
	
	if(parseFloat(version) < 5.3) {
		handler = 'handlerFileupload';
	} else {
		handler = 'fileupload';
	}
	/**
	 * Upload Handler
	 * 
	 * This handler is fired acter the form ajax request settings are settle but before the request is fired.
	 * The request is passed on $callback function, we trigger if there is a url after the files are uploaded.
	 * 
	 * form - is the form being submitted
	 * url - the url where the form is going
	 * $callback - form ajax request callback to fire after the files are uploaded.
	 */
	this.handler(handler, function(form, url, $callback) {
		console.log('uploading...');
		var count = 0;
		for(var i = 0; i < form.length; i++) {if(form[i].type=='file') {if(form[i].value) {count = true;break;}}}
		if(!count) {//no files
			return false;
		}
		
		iframe = CJAX.create.frame('frame_upload');
		iframe.style.display = 'none';
		iframe.width = '400';
		iframe.height = '200';
		form.appendChild(iframe);
		
		for(x in settings) {
			extra = document.createElement('input');
			extra.type = 'hidden';
			extra.name = 'a['+x+']';
			extra.value = settings[x];
			form.appendChild(extra);
		}
		
		with(form) {
			method = 'POST';
			action = uploader.ajaxFile+'?controller=uploader&function=upload&cjax_iframe=1';
			enctype = "multipart/form-data";
			target = iframe.name;
		}

		form.submit();
		uploader.load(iframe, function() {
			response = iframe.contentWindow.document.body.innerHTML;
			CJAX.process_all(response);
			console.log(url, settings);
			if(url) {
				$callback(false);
			}
		});
		return iframe;
	});
	
}