// ── Page Navigation ───────────────────────────────────────────────────────────
function openPage(id) {
  const page = pages[id];
  if (!page) return;
  document.getElementById("page-modal-title").textContent = page.title;
  document.getElementById("page-modal-content").innerHTML = page.content;
  document.getElementById("page-modal").classList.add("open");
  document.getElementById("page-modal-body").scrollTop = 0;
  document.body.style.overflow = "hidden";
}

function closePage() {
  document.getElementById("page-modal").classList.remove("open");
  document.body.style.overflow = "";
}

function goToCategory(cat) {
  closePage();
  setCategory(cat);
  setTimeout(() => {
    document.querySelector(".page-layout").scrollIntoView({ behavior: "smooth" });
  }, 420);
}

// ── Order Tracking ─────────────────────────────────────────────────────────────
function trackOrder() {
  const input  = document.getElementById("track-input");
  const result = document.getElementById("track-result");
  const val    = input.value.trim();

  if (!val || val.length < 4) {
    result.innerHTML = `<div class="track-error">Por favor ingresa un número de pedido válido (mínimo 4 dígitos).</div>`;
    result.style.display = "block";
    return;
  }

  const steps = [
    { icon: "✅", label: "Pedido confirmado",  date: "3 Jun 2026", desc: "Tu pedido fue recibido y confirmado exitosamente.", done: true },
    { icon: "📦", label: "En preparación",     date: "4 Jun 2026", desc: "Estamos empacando tu pedido con cuidado.",         done: true },
    { icon: "🚚", label: "En camino",           date: "5 Jun 2026", desc: "Tu paquete está en ruta hacia tu dirección.",      done: true },
    { icon: "🏠", label: "Entregado",           date: "Estimado: 7 Jun 2026", desc: "Pendiente de entrega final.",            done: false },
  ];

  result.innerHTML = `
    <div class="track-success">
      <p class="track-order-num">📦 Pedido #${val}</p>
      <div class="track-timeline">
        ${steps.map(s => `
          <div class="track-step ${s.done ? "done" : "pending"}">
            <div class="track-step-icon">${s.icon}</div>
            <div class="track-step-info">
              <strong>${s.label}</strong>
              <span>${s.date}</span>
              <p>${s.desc}</p>
            </div>
          </div>`).join("")}
      </div>
    </div>`;
  result.style.display = "block";
}

// ── Contact Form ───────────────────────────────────────────────────────────────
function submitContact(e) {
  e.preventDefault();
  const btn = document.getElementById("contact-submit");
  btn.textContent = "Enviando...";
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById("contact-form").innerHTML = `
      <div class="contact-success">
        <div style="font-size:64px;margin-bottom:16px">✉️</div>
        <h3>¡Mensaje enviado!</h3>
        <p>Nos pondremos en contacto en menos de 24 horas. ¡Gracias!</p>
      </div>`;
  }, 1200);
}

// ── Pages ─────────────────────────────────────────────────────────────────────
const pages = {

  ayuda: {
    title: "Centro de Ayuda",
    content: `
      <div class="pg-hero">
        <h2>¿En qué podemos ayudarte?</h2>
        <p>Respuestas rápidas a las preguntas más frecuentes</p>
      </div>
      <div class="faq-list">
        <details class="faq-item"><summary>¿Cuánto tiempo tarda el envío?</summary><div class="faq-body">Los envíos estándar tardan 3–5 días hábiles. Express llega en 24–48 h. Gratis en pedidos mayores a $99.</div></details>
        <details class="faq-item"><summary>¿Cómo hago una devolución?</summary><div class="faq-body">Tienes 30 días desde la recepción. El producto debe estar sin uso y en embalaje original. Solicítala desde tu perfil o en soporte@okitashops.com.</div></details>
        <details class="faq-item"><summary>¿Qué métodos de pago aceptan?</summary><div class="faq-body">Visa, Mastercard, Amex, PayPal, transferencia bancaria y efectivo en puntos autorizados.</div></details>
        <details class="faq-item"><summary>¿Los productos tienen garantía?</summary><div class="faq-body">Todos incluyen mínimo 12 meses de garantía oficial. Muchos tienen 24 meses. También ofrecemos garantía extendida de hasta 3 años.</div></details>
        <details class="faq-item"><summary>¿Puedo cancelar o modificar mi pedido?</summary><div class="faq-body">Sí, dentro de las primeras 2 horas de haberlo realizado. Después entrará en preparación y no será posible modificarlo.</div></details>
        <details class="faq-item"><summary>¿Tienen tienda física?</summary><div class="faq-body">Somos 100% online, lo que nos permite ofrecerte los mejores precios sin costos de local. Enviamos a todo el país.</div></details>
        <details class="faq-item"><summary>¿Cómo contacto con soporte?</summary><div class="faq-body">Chat en vivo 24/7, email a soporte@okitashops.com o llamada al +1 800 OKITA (Lun–Vie, 9am–6pm).</div></details>
        <details class="faq-item"><summary>¿Los precios incluyen impuestos?</summary><div class="faq-body">Sí, todos los precios ya incluyen impuestos. No hay cargos sorpresa al finalizar la compra.</div></details>
      </div>
      <div class="pg-cta-box">
        <h3>¿No encontraste tu respuesta?</h3>
        <p>Nuestro equipo está disponible 24/7 para ayudarte</p>
        <button class="pg-btn" onclick="openPage('contacto')">Contactar soporte</button>
      </div>`
  },

  seguimiento: {
    title: "Seguimiento de Pedido",
    content: `
      <div class="pg-hero">
        <h2>Rastrea tu pedido</h2>
        <p>Ingresa tu número de pedido para ver el estado en tiempo real</p>
      </div>
      <div class="track-box">
        <div class="track-form">
          <input type="text" id="track-input" class="form-control" placeholder="Ej. 20260001234" maxlength="20" onkeydown="if(event.key==='Enter')trackOrder()" />
          <button class="pg-btn" onclick="trackOrder()">🔍 Rastrear</button>
        </div>
        <div id="track-result" style="display:none;margin-top:28px"></div>
      </div>
      <div class="pg-section">
        <h3>¿Cómo funciona el seguimiento?</h3>
        <div class="pg-grid-2">
          <div class="step-card"><div class="step-icon">📋</div><strong>Confirmado</strong><p>Tu pedido fue recibido y está siendo procesado.</p></div>
          <div class="step-card"><div class="step-icon">📦</div><strong>En preparación</strong><p>Empacamos y verificamos cada producto con cuidado.</p></div>
          <div class="step-card"><div class="step-icon">🚚</div><strong>En camino</strong><p>Tu paquete salió de nuestro almacén y está en ruta.</p></div>
          <div class="step-card"><div class="step-icon">🏠</div><strong>Entregado</strong><p>¡Tu pedido llegó! Esperamos que lo disfrutes.</p></div>
        </div>
      </div>`
  },

  devoluciones: {
    title: "Devoluciones",
    content: `
      <div class="pg-hero">
        <h2>Política de Devoluciones</h2>
        <p>Tu satisfacción es nuestra prioridad. Sin complicaciones.</p>
      </div>
      <div class="pg-grid-3" style="margin-bottom:48px">
        <div class="stat-card"><strong>30 días</strong><span>Para solicitar devolución</span></div>
        <div class="stat-card"><strong>Gratis</strong><span>Sin costo de retorno</span></div>
        <div class="stat-card"><strong>5 días</strong><span>Para recibir reembolso</span></div>
      </div>
      <div class="pg-section">
        <h3>¿Cómo hacer una devolución?</h3>
        <div class="return-steps">
          <div class="return-step"><div class="return-num">1</div><div><strong>Solicita la devolución</strong><p>Ingresa a tu cuenta, selecciona el pedido y haz clic en "Devolver". También puedes escribirnos directamente.</p></div></div>
          <div class="return-step"><div class="return-num">2</div><div><strong>Empaca el producto</strong><p>Colócalo en su embalaje original con todos los accesorios incluidos.</p></div></div>
          <div class="return-step"><div class="return-num">3</div><div><strong>Programa la recolección</strong><p>Te enviamos una etiqueta de retorno gratis. Elige la fecha que prefieras.</p></div></div>
          <div class="return-step"><div class="return-num">4</div><div><strong>Recibe tu reembolso</strong><p>Al recibir el producto, procesamos tu reembolso en 3–5 días hábiles.</p></div></div>
        </div>
      </div>
      <div class="pg-section">
        <h3>Condiciones</h3>
        <ul class="policy-list">
          <li>El producto debe estar en estado original, sin uso y con embalaje completo.</li>
          <li>Productos con daño físico causado por el usuario no son elegibles.</li>
          <li>Software y contenido digital descargado no son reembolsables.</li>
          <li>Los productos personalizados no aplican para devolución.</li>
          <li>El período comienza desde la fecha de recepción del pedido.</li>
        </ul>
      </div>`
  },

  garantia: {
    title: "Garantía",
    content: `
      <div class="pg-hero">
        <h2>Garantía OKITA</h2>
        <p>Todos nuestros productos están respaldados por garantía oficial</p>
      </div>
      <div class="pg-grid-3" style="margin-bottom:48px">
        <div class="guarantee-card">
          <div class="guarantee-icon">🛡️</div>
          <strong>Estándar</strong>
          <span class="guarantee-time">12 meses</span>
          <p>Incluida en todos los productos. Cubre defectos de fabricación y fallas de hardware.</p>
        </div>
        <div class="guarantee-card featured">
          <div class="guarantee-icon">⚡</div>
          <strong>Plus</strong>
          <span class="guarantee-time">24 meses</span>
          <p>Disponible en productos seleccionados. Soporte técnico prioritario y reemplazo rápido.</p>
        </div>
        <div class="guarantee-card">
          <div class="guarantee-icon">👑</div>
          <strong>Premium</strong>
          <span class="guarantee-time">36 meses</span>
          <p>Protección total, incluyendo cobertura contra daños accidentales.</p>
        </div>
      </div>
      <div class="pg-section">
        <h3>¿Qué cubre la garantía?</h3>
        <div class="pg-grid-2">
          <div>
            <h4 style="color:var(--accent3);margin-bottom:12px;font-size:15px">✅ Cubierto</h4>
            <ul class="policy-list">
              <li>Defectos de fabricación</li>
              <li>Fallas de hardware sin causa externa</li>
              <li>Batería con menos del 80% de capacidad</li>
              <li>Pantallas con píxeles muertos</li>
              <li>Puertos y conectores defectuosos</li>
            </ul>
          </div>
          <div>
            <h4 style="color:var(--accent2);margin-bottom:12px;font-size:15px">❌ No cubierto</h4>
            <ul class="policy-list">
              <li>Daños por caídas o golpes</li>
              <li>Daños por líquidos</li>
              <li>Desgaste normal por uso</li>
              <li>Modificaciones no autorizadas</li>
              <li>Daños por software de terceros</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="pg-cta-box">
        <h3>¿Tu producto tiene un problema?</h3>
        <p>Contáctanos y lo resolvemos lo antes posible</p>
        <button class="pg-btn" onclick="openPage('contacto')">Solicitar garantía</button>
      </div>`
  },

  contacto: {
    title: "Contacto",
    content: `
      <div class="pg-hero">
        <h2>Estamos aquí para ayudarte</h2>
        <p>Respuesta garantizada en menos de 24 horas</p>
      </div>
      <div class="contact-layout">
        <div class="contact-info">
          <div class="contact-method">
            <div class="contact-method-icon">💬</div>
            <div>
              <strong>Chat en vivo</strong>
              <p>Disponible 24/7</p>
              <span class="contact-badge online">● En línea ahora</span>
            </div>
          </div>
          <div class="contact-method">
            <div class="contact-method-icon">📧</div>
            <div>
              <strong>Email</strong>
              <p>soporte@okitashops.com</p>
              <span>Respuesta en &lt;24h</span>
            </div>
          </div>
          <div class="contact-method">
            <div class="contact-method-icon">📞</div>
            <div>
              <strong>Teléfono</strong>
              <p>+1 800 OKITA</p>
              <span>Lun–Vie, 9am–6pm</span>
            </div>
          </div>
          <div class="contact-method">
            <div class="contact-method-icon">🌎</div>
            <div>
              <strong>Cobertura</strong>
              <p>100% Online</p>
              <span>Envíos a todo el país</span>
            </div>
          </div>
        </div>
        <form id="contact-form" class="contact-form" onsubmit="submitContact(event)">
          <div class="form-group">
            <label class="form-label">Nombre completo</label>
            <input type="text" class="form-control" placeholder="Tu nombre" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" placeholder="tu@email.com" required />
          </div>
          <div class="form-group">
            <label class="form-label">Asunto</label>
            <select class="form-control">
              <option>Consulta sobre un producto</option>
              <option>Estado de mi pedido</option>
              <option>Devolución o garantía</option>
              <option>Problema técnico</option>
              <option>Otro</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Mensaje</label>
            <textarea class="form-control" rows="5" placeholder="Describe tu consulta con detalle..." required></textarea>
          </div>
          <button type="submit" id="contact-submit" class="pg-btn" style="width:100%">✉️ Enviar mensaje</button>
        </form>
      </div>`
  },

  nosotros: {
    title: "Sobre Nosotros",
    content: `
      <div class="pg-hero">
        <h2>Somos OKITA SHOPS</h2>
        <p>Tu marketplace de tecnología de confianza desde 2022</p>
      </div>
      <div class="about-mission">
        En <strong>OKITA SHOPS</strong> creemos que la tecnología de punta no debería ser un lujo. Nuestro objetivo es acercar los mejores productos tecnológicos a todas las personas, con precios justos, garantía real y un servicio que realmente funciona.
      </div>
      <div class="pg-grid-3" style="margin-bottom:48px">
        <div class="stat-card"><strong>+12,000</strong><span>Clientes satisfechos</span></div>
        <div class="stat-card"><strong>500+</strong><span>Productos disponibles</span></div>
        <div class="stat-card"><strong>4.9★</strong><span>Calificación promedio</span></div>
        <div class="stat-card"><strong>98%</strong><span>Entregas a tiempo</span></div>
        <div class="stat-card"><strong>24/7</strong><span>Soporte disponible</span></div>
        <div class="stat-card"><strong>4 años</strong><span>En el mercado</span></div>
      </div>
      <div class="pg-section">
        <h3>Nuestros valores</h3>
        <div class="pg-grid-3">
          <div class="value-card"><div class="value-icon">🔬</div><strong>Innovación</strong><p>Siempre traemos lo último del mercado tech. Si existe, lo tenemos.</p></div>
          <div class="value-card"><div class="value-icon">🤝</div><strong>Confianza</strong><p>Garantía en todos los productos, devoluciones sin preguntas.</p></div>
          <div class="value-card"><div class="value-icon">💚</div><strong>Servicio real</strong><p>Personas reales resolviendo tus problemas, no bots.</p></div>
        </div>
      </div>
      <div class="pg-section">
        <h3>El equipo</h3>
        <div class="pg-grid-3">
          <div class="team-card"><div class="team-avatar">👨‍💼</div><strong>Luís Okita</strong><span>CEO & Fundador</span></div>
          <div class="team-card"><div class="team-avatar">👩‍💻</div><strong>Ana García</strong><span>CTO</span></div>
          <div class="team-card"><div class="team-avatar">👨‍🎨</div><strong>Carlos Méndez</strong><span>Head of Design</span></div>
          <div class="team-card"><div class="team-avatar">👩‍📦</div><strong>María López</strong><span>Head of Operations</span></div>
          <div class="team-card"><div class="team-avatar">👨‍📱</div><strong>Diego Torres</strong><span>Product Manager</span></div>
          <div class="team-card"><div class="team-avatar">👩‍🎧</div><strong>Sofía Reyes</strong><span>Head of Support</span></div>
        </div>
      </div>`
  },

  blog: {
    title: "Blog",
    content: `
      <div class="pg-hero">
        <h2>Blog OKITA</h2>
        <p>Reviews, comparativas y guías de compra del mundo tech</p>
      </div>
      <div class="blog-grid">
        ${[
          { img: "https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=600&h=340", tag: "Review",      title: "iPhone 15 Pro Max: ¿Vale la pena en 2026?",           excerpt: "Analizamos en profundidad el smartphone más avanzado de Apple. Rendimiento, cámara, batería y diseño en titanio.", date: "1 Jun 2026",  min: "8" },
          { img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&h=340", tag: "Comparativa", title: "MacBook Pro M3 vs Dell XPS 15: ¿Cuál elegir?",         excerpt: "Enfrentamos dos laptops premium. Rendimiento, pantalla, batería y precio: ¿cuál gana?",                          date: "28 May 2026", min: "12" },
          { img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&h=340", tag: "Gaming",      title: "RTX 4090: La GPU definitiva para gaming 4K",           excerpt: "¿Merece su precio? Probamos la tarjeta más potente de NVIDIA con los juegos más exigentes del mercado.",          date: "22 May 2026", min: "10" },
          { img: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=600&h=340", tag: "Guía",        title: "PS5 Pro vs Xbox Series X: ¿Cuál consola comprar?",    excerpt: "Guía completa para decidir entre las dos grandes consolas de esta generación.",                                  date: "15 May 2026", min: "9" },
          { img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&h=340", tag: "Wearables",   title: "Apple Watch Ultra 2: Para quienes lo exigen todo",     excerpt: "GPS de doble frecuencia, titanio aeroespacial y 60 horas de batería. Todo lo que necesitas saber.",              date: "10 May 2026", min: "7" },
          { img: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=600&h=340", tag: "Drones",      title: "DJI Mini 4 Pro: El mejor dron compacto del año",      excerpt: "Menos de 249g, 4K/60fps y sensor omnidireccional. La combinación perfecta para creadores de contenido.",        date: "5 May 2026",  min: "11" }
        ].map(p => `
          <article class="blog-card">
            <div class="blog-card-img">
              <img src="${p.img}" alt="${p.title}" loading="lazy" />
              <span class="blog-tag">${p.tag}</span>
            </div>
            <div class="blog-card-body">
              <h3>${p.title}</h3>
              <p>${p.excerpt}</p>
              <div class="blog-meta"><span>📅 ${p.date}</span><span>⏱ ${p.min} min lectura</span></div>
            </div>
          </article>`).join("")}
      </div>`
  },

  trabaja: {
    title: "Trabaja con Nosotros",
    content: `
      <div class="pg-hero">
        <h2>Únete al equipo OKITA</h2>
        <p>Buscamos personas apasionadas por la tecnología y el servicio</p>
      </div>
      <div class="pg-grid-3" style="margin-bottom:48px">
        <div class="value-card"><div class="value-icon">🏠</div><strong>100% Remoto</strong><p>Trabaja desde donde quieras en el mundo.</p></div>
        <div class="value-card"><div class="value-icon">📈</div><strong>Crecimiento real</strong><p>Plan de carrera y revisiones salariales cada 6 meses.</p></div>
        <div class="value-card"><div class="value-icon">🎯</div><strong>Impacto directo</strong><p>Tu trabajo se nota desde el día uno. Sin burocracia.</p></div>
      </div>
      <div class="pg-section">
        <h3>Posiciones abiertas</h3>
        <div class="job-list">
          ${[
            { title: "Desarrollador Frontend",            dept: "Tecnología",  type: "Full-time · Remoto",  desc: "Experiencia en React o Vue para mejorar nuestra plataforma. Se valora TypeScript y experiencia con Tailwind." },
            { title: "Diseñador UX/UI",                   dept: "Diseño",      type: "Full-time · Remoto",  desc: "Transforma insights de usuario en interfaces hermosas y funcionales. Figma obligatorio." },
            { title: "Especialista en Marketing Digital", dept: "Marketing",   type: "Full-time · Remoto",  desc: "Estrategia SEO, SEM y redes sociales. Experiencia con Meta Ads y Google Ads es un plus." },
            { title: "Ejecutivo de Atención al Cliente",  dept: "Soporte",     type: "Part-time · Remoto",  desc: "Personas empáticas y resolutivas para nuestro equipo 24/7. Inglés intermedio requerido." },
            { title: "Gestor de Logística",               dept: "Operaciones", type: "Full-time · Híbrido", desc: "Coordinación con proveedores, gestión de inventario y seguimiento de cadena de suministro." },
          ].map(j => `
            <div class="job-card">
              <div class="job-card-top">
                <div>
                  <h4>${j.title}</h4>
                  <div class="job-meta">
                    <span class="job-dept">${j.dept}</span>
                    <span class="job-type">${j.type}</span>
                  </div>
                </div>
                <button class="pg-btn-outline" onclick="openPage('contacto')">Aplicar →</button>
              </div>
              <p class="job-desc">${j.desc}</p>
            </div>`).join("")}
        </div>
      </div>
      <div class="pg-cta-box">
        <h3>¿No ves tu perfil?</h3>
        <p>Envíanos tu CV igual. Si eres bueno en lo que haces, queremos conocerte.</p>
        <button class="pg-btn" onclick="openPage('contacto')">Enviar CV espontáneo</button>
      </div>`
  },

  terminos: {
    title: "Términos y Condiciones",
    content: `
      <div class="pg-hero">
        <h2>Términos y Condiciones</h2>
        <p>Última actualización: 1 de junio de 2026</p>
      </div>
      <div class="policy-text">
        <h3>1. Aceptación</h3><p>Al acceder y usar OKITA SHOPS, aceptas quedar vinculado por estos términos. Si no estás de acuerdo, no uses el servicio.</p>
        <h3>2. Uso del servicio</h3><p>OKITA SHOPS es una plataforma de e-commerce de productos tecnológicos. Te comprometes a usarla solo con fines lícitos y sin infringir derechos de terceros.</p>
        <h3>3. Cuentas de usuario</h3><p>Eres responsable de mantener la confidencialidad de tu cuenta. Notifícanos de inmediato cualquier uso no autorizado.</p>
        <h3>4. Precios y pagos</h3><p>Todos los precios están en USD e incluyen impuestos. Nos reservamos el derecho de modificar precios, aunque los pedidos ya confirmados no se verán afectados.</p>
        <h3>5. Envíos</h3><p>Los tiempos de entrega son estimados. OKITA SHOPS no se responsabiliza por retrasos causados por terceros logísticos o fuerza mayor.</p>
        <h3>6. Devoluciones y garantías</h3><p>Se rigen por nuestras políticas específicas descritas en las secciones de Devoluciones y Garantía.</p>
        <h3>7. Propiedad intelectual</h3><p>Todo el contenido (logos, textos, código) es propiedad de OKITA SHOPS. Está prohibida su reproducción sin autorización.</p>
        <h3>8. Limitación de responsabilidad</h3><p>OKITA SHOPS no será responsable por daños indirectos derivados del uso o imposibilidad de uso de nuestros servicios.</p>
        <h3>9. Modificaciones</h3><p>Podemos actualizar estos términos en cualquier momento. El uso continuado implica aceptación.</p>
        <h3>10. Contacto legal</h3><p>legal@okitashops.com</p>
      </div>`
  },

  privacidad: {
    title: "Política de Privacidad",
    content: `
      <div class="pg-hero">
        <h2>Política de Privacidad</h2>
        <p>Última actualización: 1 de junio de 2026</p>
      </div>
      <div class="policy-text">
        <h3>1. Información que recopilamos</h3><p>Nombre, email, dirección, datos de pago (proporcionados por ti) y datos de uso: páginas visitadas, productos vistos, búsquedas realizadas.</p>
        <h3>2. Cómo usamos tu información</h3><p>Para procesar pedidos, personalizar tu experiencia, enviarte comunicaciones sobre tu cuenta, mejorar nuestros servicios y cumplir obligaciones legales.</p>
        <h3>3. Compartir información</h3><p>No vendemos tus datos. Los compartimos solo con socios operativos (logística, pagos) bajo estrictos acuerdos de confidencialidad.</p>
        <h3>4. Cookies</h3><p>Usamos cookies para tu sesión, carrito y preferencias, y para análisis anónimo de tráfico. Puedes desactivarlas en tu navegador.</p>
        <h3>5. Seguridad</h3><p>Implementamos cifrado SSL, autenticación de dos factores y auditorías periódicas de seguridad para proteger tus datos.</p>
        <h3>6. Tus derechos</h3><p>Tienes derecho a acceder, corregir, eliminar y exportar tus datos. Escríbenos a privacidad@okitashops.com.</p>
        <h3>7. Retención de datos</h3><p>Conservamos tus datos mientras tengas una cuenta activa. Al eliminarla, se borran en máximo 30 días, salvo obligación legal.</p>
        <h3>8. Cambios</h3><p>Te notificaremos por email sobre cambios significativos con al menos 15 días de anticipación.</p>
        <h3>9. Contacto</h3><p>privacidad@okitashops.com</p>
      </div>`
  }

};
