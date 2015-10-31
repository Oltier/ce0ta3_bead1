$(function() {
    $(document).on('click', 'a.btn-dange', function(e) {
        e.preventDefault();
        
        var $tr = $(this).closest('tr');
        
        $.ajax(this.href, {
            dataType: 'json,'
        })
        .done(function(data) {
            if(data.success){
                $tr.hide('slow');
            }
        })
        .fail(function() {
            console.log('fail');
        });
    })
})