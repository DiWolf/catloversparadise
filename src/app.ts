import dotenv from "dotenv";
dotenv.config(); // Asegura que las variables de entorno se carguen
import i18n from "i18n";
import path from "path";
import express from "express";
import methodOverride from "method-override";
import nunjucks from "nunjucks";
import expressSession from "express-session";
import flash from "connect-flash"; // Importa connect-flash
import cookieParser from "cookie-parser"; // <--- ¡Asegúrate de tenerlo!
import fs from "fs";
//Middleware y utilidades
//import homeRoute from "@routes/portal.route";

//admin


// portal 
import indexRouter from '@routes/portal/portal.router';
// admin
import adminRouter from '@routes/admin/admin.router';
//import { mergeLocales } from "@utils/merge-locales";
//Rutas
const localesPath = path.join(process.cwd(), "locales");

const app = express();

// Servir archivos estáticos desde /public
app.use("/public", express.static(path.join(__dirname, "..", "public")));

app.use(cookieParser()); // <-- antes que i18n.init

// Configurar i18n
console.log('Locales path:', localesPath);
console.log('Locales exist:', require('fs').existsSync(localesPath));

i18n.configure({
  locales: ['eng', 'sp', 'zh'],
  directory: localesPath,
  defaultLocale: 'eng',
  cookie: 'lang',
  queryParameter: 'lang',
  autoReload: true,
  updateFiles: false,
  api: {
    '__': 't',
    '__n': 'tn'
  }
});

// Inicializar i18n
app.use(i18n.init);

// Middleware para manejar cambio de idioma (DESPUÉS de i18n.init)
app.use((req, res, next) => {
  if (req.query.lang && i18n.getLocales().includes(req.query.lang as string)) {
    res.cookie("lang", req.query.lang, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 días
    });
    (req as any).setLocale(req.query.lang as string);
  }
  next();
});

// Middleware para hacer las traducciones disponibles en las vistas
app.use((req, res, next) => {
  // Función de traducción que usa el contexto de la request
  res.locals.t = (key: string, options?: any) => {
    try {
      return (req as any).t(key, options);
    } catch (error) {
      console.log('Translation error for key:', key, error);
      return key; // Devolver la clave si hay error
    }
  };
  res.locals.currentLocale = () => {
    return (req as any).getLocale() || 'eng';
  };
  next();
});

app.use("/public", express.static(path.join(__dirname, "..", "public")));
app.set("view engine", "njk");
// const env = nunjucks.configure("src/views", {
//   autoescape: true,
//   express: app,
//   watch: true,
// });

// Configuración de vistas con Nunjucks
const env = nunjucks.configure(path.join(__dirname, ".", "views"), {
  autoescape: true,
  express: app,
  watch: process.env.NODE_ENV !== "production", // watch solo en dev
});

// Registrar como filtro para usar en la vista
env.addFilter("startsWith", function (value: any, prefix: string) {
  if (typeof value !== "string") return false;
  return value.startsWith(prefix);
});

// Filtro de fecha
env.addFilter("date", function (value: any, format: string) {
  console.log('🔍 Date filter called with:', value, format);
  // Si el valor es null, undefined, o vacío, devolver cadena vacía
  if (value === null || value === undefined || value === '') {
    return '';
  }
  
  let date: Date;
  
  // Si es string "now", usar fecha actual
  if (value === "now") {
    date = new Date();
  } else if (typeof value === 'string') {
    date = new Date(value);
  } else if (value instanceof Date) {
    date = value;
  } else {
    return format; // Si no es una fecha válida, devolver el formato
  }
  
  if (isNaN(date.getTime())) {
    return format; // Si la fecha es inválida, devolver el formato
  }
  
  // Formatear la fecha según el formato solicitado
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  // Reemplazar solo las partes que existen en el formato
  let result = format;
  console.log('🔧 Before replacements:', result);
  console.log('🔧 Date parts:', { day, month, year, hours, minutes, seconds });
  
  if (format.includes('DD')) result = result.replace(/DD/g, day);
  if (format.includes('MM')) result = result.replace(/MM/g, month);
  if (format.includes('YYYY')) result = result.replace(/YYYY/g, year.toString());
  if (format.includes('HH')) result = result.replace(/HH/g, hours);
  if (format.includes('mm')) result = result.replace(/mm/g, minutes);
  if (format.includes('ss')) result = result.replace(/ss/g, seconds);
  
  console.log('🔧 After replacements:', result);
  return result;
});

// No necesitamos agregar globals de traducción aquí
// Las traducciones se manejan a través de res.locals.t

// Configurar flash
app.use(flash()); // Habilitar connect-flash

// Middleware nativo de Express para parsear JSON
app.use(express.json()); // Para manejar solicitudes JSON
app.use(express.urlencoded({ extended: true })); // Para manejar formularios URL-encoded
// Permite usar ?_method=PUT o ?_method=DELETE en formularios
app.use(methodOverride("_method"));
app.use(
  expressSession({
    secret: "mysecretkey", // Clave secreta para firmar las sesiones
    resave: false,
    saveUninitialized: true, // Asegúrate de no guardar sesiones vacías
    cookie: { secure: false }, // Para pruebas locales, debe ser true en producción
  })
);

// Filtro date: soporta múltiples formatos
env.addFilter("date", (value: any, pattern = "DD/MM/YYYY") => {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(+d)) return "—";
  
  const pad = (n: number) => String(n).padStart(2, "0");
  
  // Nombres de meses en español
  const monthNames = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  
  const map: Record<string, string> = {
    // Días
    DD: pad(d.getDate()),
    d: String(d.getDate()),
    
    // Meses
    MM: pad(d.getMonth() + 1),
    M: String(d.getMonth() + 1),
    MMMM: monthNames[d.getMonth()],
    
    // Años
    YYYY: String(d.getFullYear()),
    yyyy: String(d.getFullYear()),
    YY: String(d.getFullYear()).slice(-2),
    yy: String(d.getFullYear()).slice(-2),
  };
  
  // Reemplazar patrones en orden de longitud (más largos primero)
  // Usamos word boundaries (\b) para evitar reemplazar letras dentro de palabras
  return pattern.replace(/\bYYYY\b|\byyyy\b|\bMMMM\b|\bMM\b|\bDD\b|\bYY\b|\byy\b|\bM\b|\bd\b/g, (match: string) => map[match] || match);
});

// ✅ año disponible en todas las vistas
env.addGlobal("year", new Date().getFullYear());

// Rutas
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.user = req.session.user || null; // 👈 aquí inyectas el usuario
  next();
});

app.use("/", indexRouter);
app.use("/admin", adminRouter);

//app.use("/artemis/blog/categories",adminCategoriesRouter)


// Manejo de 404 - debe ir al final de todas las rutas
app.use((req, res) => {
  res.status(404).render("portal/404.njk", {
    title: "Página no encontrada",
    currentPath: req.path,
    year: new Date().getFullYear()
  });
});

// Manejo global de errores 500
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error interno del servidor:", error);
  
  // Log del error para debugging
  console.error("Error details:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(500).render("portal/500.njk", {
    title: "Error del servidor",
    error: process.env.NODE_ENV === 'development' ? error : null,
    NODE_ENV: process.env.NODE_ENV,
    year: new Date().getFullYear(),
    t: res.locals.t || ((key: string) => key) // Asegurar que t esté disponible
  });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
