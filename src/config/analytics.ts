// Configuración de Analytics y herramientas SEO

export interface AnalyticsConfig {
    googleAnalytics?: string;
    googleTagManager?: string;
    facebookPixel?: string;
    hotjar?: string;
}

export const analyticsConfig: AnalyticsConfig = {
    // Agregar IDs cuando estén disponibles
    googleAnalytics: process.env.GOOGLE_ANALYTICS_ID,
    googleTagManager: process.env.GOOGLE_TAG_MANAGER_ID,
    facebookPixel: process.env.FACEBOOK_PIXEL_ID,
    hotjar: process.env.HOTJAR_ID
};

// Generar script de Google Analytics
export function generateGoogleAnalyticsScript(gaId?: string): string {
    if (!gaId) return '';
    
    return `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}', {
            page_title: document.title,
            page_location: window.location.href
        });
    </script>`;
}

// Generar script de Google Tag Manager
export function generateGTMScript(gtmId?: string): string {
    if (!gtmId) return '';
    
    return `
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');</script>
    <!-- End Google Tag Manager -->`;
}

// Generar noscript de GTM
export function generateGTMNoscript(gtmId?: string): string {
    if (!gtmId) return '';
    
    return `
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`;
}

// Generar script de Facebook Pixel
export function generateFacebookPixelScript(pixelId?: string): string {
    if (!pixelId) return '';
    
    return `
    <!-- Facebook Pixel Code -->
    <script>
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Facebook Pixel Code -->`;
}

// Generar script de Hotjar
export function generateHotjarScript(hotjarId?: string): string {
    if (!hotjarId) return '';
    
    return `
    <!-- Hotjar Tracking Code -->
    <script>
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${hotjarId},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    </script>`;
}

// Generar todos los scripts de analytics
export function generateAllAnalyticsScripts(): string {
    const scripts = [
        generateGoogleAnalyticsScript(analyticsConfig.googleAnalytics),
        generateGTMScript(analyticsConfig.googleTagManager),
        generateFacebookPixelScript(analyticsConfig.facebookPixel),
        generateHotjarScript(analyticsConfig.hotjar)
    ].filter(script => script.trim() !== '').join('\n');
    
    return scripts;
}

