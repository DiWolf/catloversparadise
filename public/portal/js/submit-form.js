$(function () {
    'use strict';

    // Retrieve all the forms that we want to apply Bootstrap custom validation styles.
    const forms = $('.needs-validation');

    // Loop through the forms and prevent submission.
    forms.on('submit', function (event) {
        const form = $(this);

        var actionInput = $(this).find("input[name='action']");

        if (!form[0].checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            $('.submit_form').html('Sending...');
            $('.submit_comment').html('Sending...');
            $('.submit_appointment').html('Sending...');
            const toast = new bootstrap.Toast($('.success_msg')[0]);
            const errtoast = new bootstrap.Toast($('.error_msg')[0]);
            var formData = forms.serialize();
            // Determinar la URL del endpoint basado en el tipo de formulario
            let endpoint = "php/form_process.php";
            if (actionInput.length === 0) {
                // Formulario de contacto - usar el nuevo endpoint
                endpoint = "/contact";
            }

            $.ajax({
                type: "POST",
                url: endpoint,
                data: formData,
                success: function (response) {
                    if (actionInput.length > 0) {
                        // Formularios con acción específica (appointment, comment)
                        if (response == 'success') {
                            if (actionInput.val() == 'appointment') {
                                $('.submit_appointment').html('Make Appointment');
                                const toast_appointment = new bootstrap.Toast($('.success_msg_appointment')[0]);
                                toast_appointment.show();
                            } else if (actionInput.val() == 'comment') {
                                $('.submit_comment').html('Post Comment');
                                const toast_comment = new bootstrap.Toast($('.success_msg_comment')[0]);
                                toast_comment.show();
                            }
                        } else {
                            errtoast.show();
                            console.log('Error en formulario con acción');
                            $('.submit_appointment').html('Make Appointment');
                            $('.submit_comment').html('Post Comment');
                        }
                    } else {
                        // Formulario de contacto - manejar respuesta JSON
                        if (response.success) {
                            toast.show();
                            $('.submit_form').html('Send Message');
                            // Limpiar el formulario
                            form[0].reset();
                            form.removeClass('was-validated');
                        } else {
                            errtoast.show();
                            console.log('Error en formulario de contacto:', response.message);
                            $('.submit_form').html('Send Message');
                        }
                    }
                },
                error: function (xhr, status, error) {
                    errtoast.show();
                    console.log('Error AJAX:', error);
                    $('.submit_form').html('Send Message');
                    $('.submit_comment').html('Post Comment');
                    $('.submit_appointment').html('Make Appointment');
                }
            });
        }

        form.addClass('was-validated');
    });
});