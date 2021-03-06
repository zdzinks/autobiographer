$(function() {    
    var csrf_param = $('meta[name=csrf-param]').attr('content');
    var csrf_token = $('meta[name=csrf-token]').attr('content');

    var multipart_params = {"format" : "js"};
    multipart_params[csrf_param] = csrf_token;

    var uploader = new plupload.Uploader({
        runtimes : 'html5,flash,silverlight',
        browse_button : 'pickfiles',
        drop_element: 'dropfiles',
        container : 'upload_link',
        max_file_size : '20mb',
        url : '/photos',
        flash_swf_url : '/plupload/plupload.flash.swf',
        silverlight_xap_url : '/plupload/plupload.silverlight.xap',
        filters : [
        {title : "Image files", extensions : "jpg,gif,png"},
        {title : "Zip files", extensions : "zip"}
        ],
        multipart: true,  
        multipart_params : multipart_params,
        resize : {width : 320, height : 240, quality : 90}
    });

    uploader.init();

    uploader.bind('FilesAdded', function(up, files) {
        var file_count = ($('#upload_progress').data('file_count') || 0) + files.length;
        var current_file = $('#upload_progress').data('current_file') || 1;
        
        $('#upload_progress').data('file_count', file_count);
        $('#upload_progress').data('current_file', current_file);
        
        $('#upload_text').text("Uploading photo " + current_file + " of " + file_count + "...");
        Helpers.showStatusBar();
        up.refresh(); // Reposition Flash/Silverlight
        up.start();
    });

    uploader.bind('UploadProgress', function(up, file) {
        $('#upload_percent').text(file.percent + "%");
    });

    uploader.bind('Error', function(up, err) {
        console.log("Error: " + err.code + ", Message: " + err.message + (err.file ? ", File: " + err.file.name : ""));
        up.refresh(); // Reposition Flash/Silverlight
    });

    uploader.bind('FileUploaded', function(up, file, response) {
        var file_count = $('#upload_progress').data('file_count');
        var current_file = $('#upload_progress').data('current_file') + 1;
        
        $('#upload_progress').data('current_file', current_file);
        
        if (current_file > file_count) {
            window.location.reload();   
        } else {
            $('#upload_text').text("Uploading photo " + current_file + " of " + file_count + "...");
            $('#upload_percent').text("0%");
        }
    });
    
    window.onbeforeunload = warnIfPhotosUploading;

    function warnIfPhotosUploading() {
        var file_count = $('#upload_progress').data('file_count') || 0;
        var current_file = $('#upload_progress').data('current_file') || 1;
        
        if (current_file <= file_count) {
            return "Your photos are still uploading. Leaving this page will cancel the upload.";
        }    
    }
    
    setInterval(function() {
        if (!window.dragging) {
            $('#drop_notice').hide();
        } else {
            window.dragging = false;
        }
    }, 500);
    
    $('#dropfiles').bind('dragover', function() {
        if (!window.dragging) {
            $('#drop_notice').show();
            window.dragging = true;
        }
    });
});