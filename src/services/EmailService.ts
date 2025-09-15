import nodemailer from 'nodemailer';

export interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
}

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Verificar que las credenciales estén configuradas
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('⚠️  ADVERTENCIA: Las credenciales de email no están configuradas.');
            console.warn('   Configura SMTP_USER y SMTP_PASS en tu archivo .env');
            console.warn('   El formulario de contacto no podrá enviar emails hasta que configures estas variables.');
        }

        // Configuración del transporter de nodemailer con timeouts
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: parseInt(process.env.SMTP_PORT || '587') === 465, // 465 = SSL, otros = STARTTLS
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
            tls: {
                rejectUnauthorized: false
            },
            connectionTimeout: 10000, // 10 segundos
            greetingTimeout: 10000,   // 10 segundos
            socketTimeout: 10000      // 10 segundos
        });
    }

    async sendContactEmail(formData: ContactFormData): Promise<boolean> {
        try {
            console.log('📧 Preparando email de contacto...');
            
            const { firstName, lastName, email, phone, message } = formData;
            
            const mailOptions = {
                from: `"${firstName} ${lastName}" <${email}>`,
                to: 'contacto@catloversparadise.org',
                replyTo: email,
                subject: `Nuevo mensaje de contacto - ${firstName} ${lastName}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
                            Nuevo mensaje de contacto - Cat Lovers Paradise
                        </h2>
                        
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #495057; margin-top: 0;">Información del contacto:</h3>
                            <p><strong>Nombre:</strong> ${firstName} ${lastName}</p>
                            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                            <p><strong>Teléfono:</strong> ${phone}</p>
                        </div>
                        
                        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
                            <h3 style="color: #495057; margin-top: 0;">Mensaje:</h3>
                            <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                        
                        <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px; font-size: 12px; color: #6c757d;">
                            <p>Este mensaje fue enviado desde el formulario de contacto de Cat Lovers Paradise.</p>
                            <p>Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })}</p>
                        </div>
                    </div>
                `,
                text: `
Nuevo mensaje de contacto - Cat Lovers Paradise

Información del contacto:
- Nombre: ${firstName} ${lastName}
- Email: ${email}
- Teléfono: ${phone}

Mensaje:
${message}

---
Este mensaje fue enviado desde el formulario de contacto de Cat Lovers Paradise.
Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })}
                `
            };

            console.log('📤 Enviando email...');
            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email enviado exitosamente:', info.messageId);
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            const errorCode = (error as any)?.code || 'UNKNOWN';
            const errorName = (error as any)?.name || 'UnknownError';
            
            console.error('❌ Error enviando email:', errorMessage);
            console.error('📋 Código de error:', errorCode);
            console.error('📋 Tipo de error:', errorName);
            
            // Información adicional para depuración
            if (errorCode === 'ECONNREFUSED') {
                console.error('🔧 El servidor SMTP no está disponible o el puerto está bloqueado');
            } else if (errorCode === 'EAUTH') {
                console.error('🔧 Error de autenticación - verifica usuario y contraseña');
            } else if (errorMessage.includes('Greeting never received')) {
                console.error('🔧 El servidor no responde correctamente - problema de configuración SSL/TLS');
            } else if (errorMessage.includes('timeout')) {
                console.error('🔧 Timeout de conexión - el servidor tarda mucho en responder');
            }
            
            return false;
        }
    }

    async sendConfirmationEmail(formData: ContactFormData): Promise<boolean> {
        try {
            const { firstName, lastName, email } = formData;
            
            const mailOptions = {
                from: '"Cat Lovers Paradise" <noreply@catloversparadise.org>',
                to: email,
                subject: 'Gracias por contactarnos - Cat Lovers Paradise',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333; text-align: center;">
                            ¡Gracias por contactarnos, ${firstName}!
                        </h2>
                        
                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                            <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.</p>
                            <p>Nuestro equipo revisará tu consulta y te responderá en un plazo máximo de 24 horas.</p>
                        </div>
                        
                        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px;">
                            <h3 style="color: #495057;">¿Qué puedes hacer mientras tanto?</h3>
                            <ul>
                                <li>Explora nuestras <a href="${process.env.BASE_URL || 'http://localhost:3000'}/breeds">razas de gatos disponibles</a></li>
                                <li>Conoce más <a href="${process.env.BASE_URL || 'http://localhost:3000'}/about">sobre nosotros</a></li>
                                <li>Visita nuestra <a href="${process.env.BASE_URL || 'http://localhost:3000'}/blog">galería de fotos</a></li>
                            </ul>
                        </div>
                        
                        <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px; font-size: 12px; color: #6c757d; text-align: center;">
                            <p>Cat Lovers Paradise - Donde los gatos encuentran su hogar perfecto</p>
                            <p>Este es un mensaje automático, por favor no respondas a este email.</p>
                        </div>
                    </div>
                `,
                text: `
¡Gracias por contactarnos, ${firstName}!

Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.

Nuestro equipo revisará tu consulta y te responderá en un plazo máximo de 24 horas.

¿Qué puedes hacer mientras tanto?
- Explora nuestras razas de gatos disponibles
- Conoce más sobre nosotros
- Visita nuestra galería de fotos

---
Cat Lovers Paradise - Donde los gatos encuentran su hogar perfecto
Este es un mensaje automático, por favor no respondas a este email.
                `
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email de confirmación enviado exitosamente:', info.messageId);
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.error('Error enviando email de confirmación:', errorMessage);
            return false;
        }
    }
}

export default new EmailService();
