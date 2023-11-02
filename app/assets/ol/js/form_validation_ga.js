function formValidation(){
    $('#error-summary-list li a').each(function(){
    errorType = $(this).attr('href')
    page = window.location.pathname
        gtag('event', 'Form Validation', {'eventCategory': page, 'eventLabel': errorType});
    })
}
