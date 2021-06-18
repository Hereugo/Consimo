// Custom file drop extension
$.fn.extend({
    filedrop: function (options) {
        var defaults = {
            callback : null
        }
        options =  $.extend(defaults, options)
        return this.each(function() {
            var files = []
            var $this = $(this)
            // Stop default browser actions
            $this.bind('dragover', function(event) {
                event.stopPropagation();
                $this.css('background-color', 'red');
                event.preventDefault();
            })
            $this.bind('dragleave', function(event) {
                event.stopPropagation();
                $this.css('background-color', 'blue');
                event.preventDefault();
            });


            // Catch drop event
            $this.bind('drop', function(event) {
                // Stop default browser actionsevent.stopPropagation()
                event.preventDefault()
                $this.css('background-color', 'blue');
                // Get all files that are dropped
                files = event.originalEvent.target.files || event.originalEvent.dataTransfer.files
                // Convert uploaded file to data URL and pass trought callbackif(options.callback) {
                    var reader = new FileReader()
                    reader.onload = function(event) {
                        options.callback(event.target.result)
                    }
                    reader.readAsDataURL(files[0])
            })
        })
    }
})


// Event listener filedropper
$('.dropbox').filedrop({
    callback : function(fileEncryptedData) {
        var img = $('.dropbox img');
        img.attr('src', fileEncryptedData);
    }
})