
document.addEventListener('DOMContentLoaded', function() {
  animateKPI('valSiniestros', 2.20, 1000);
  animateKPI('valManten', 65, 1200, '%');
  animateKPI('valCapac', 45, 1400, '%');
});

function animateKPI(elementId, targetValue, duration, suffix = '') {
  const element = document.getElementById(elementId);
  if (!element) return;

  const startValue = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = startValue + (targetValue - startValue) * easeOutQuart;
    
    if (suffix === '%') {
      element.textContent = Math.round(currentValue) + suffix;
    } else {
      element.textContent = currentValue.toFixed(2);
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function exportReport() {
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Resumen PESV - BOSHMANY</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          max-width: 900px;
          margin: 0 auto;
          color: #1a202c;
          line-height: 1.6;
        }
        h1 {
          color: #1e293b;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 10px;
        }
        h2 {
          color: #3b82f6;
          margin-top: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 10px;
          text-align: left;
        }
        th {
          background: #f1f5f9;
          font-weight: bold;
        }
        .kpi-box {
          display: inline-block;
          padding: 15px 25px;
          margin: 10px;
          border: 2px solid #3b82f6;
          border-radius: 8px;
          text-align: center;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #cbd5e1;
          text-align: center;
          color: #64748b;
        }
        @media print {
          body { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <h1>🛣️ RESUMEN PESV - BOSHMANY INGENIERIA DE LA SABANA</h1>
      <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString('es-CO', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</p>
      
      ${document.querySelector('main').innerHTML}
      
      <div class="footer">
        <p>© BOSHMANY INGENIERIA DE LA SABANA — Sistema PESV 2025</p>
        <p>Documento generado automáticamente para evidencia y auditoría</p>
      </div>
    </body>
    </html>
  `);
  
  printWindow.document.close();
  
  setTimeout(() => {
    printWindow.print();
  }, 500);
}

document.getElementById('exportReport')?.addEventListener('click', exportReport);
document.getElementById('exportReport2')?.addEventListener('click', exportReport);

const imgUpload = document.getElementById('imgUpload');
const carouselInner = document.getElementById('carouselInner');
const prevImg = document.getElementById('prevImg');
const nextImg = document.getElementById('nextImg');
const clearGallery = document.getElementById('clearGallery');

let gallery = JSON.parse(localStorage.getItem('boshGallery') || '[]');
let currentIndex = 0;

function renderCarousel() {
  if (!carouselInner) return;
  
  carouselInner.innerHTML = '';
  
  if (gallery.length === 0) {
    carouselInner.innerHTML = '<div class="noimg">📸 No hay imágenes. Sube fotos de tus campañas y eventos.</div>';
    return;
  }
  
  const img = document.createElement('img');
  img.src = gallery[currentIndex];
  img.alt = `Imagen ${currentIndex + 1} de ${gallery.length}`;
  carouselInner.appendChild(img);

  const counter = document.createElement('div');
  counter.style.cssText = 'position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,0.7);color:#fff;padding:8px 12px;border-radius:6px;font-weight:600;';
  counter.textContent = `${currentIndex + 1} / ${gallery.length}`;
  carouselInner.appendChild(counter);
}

imgUpload?.addEventListener('change', function(e) {
  const files = Array.from(e.target.files);
  
  if (files.length === 0) return;
  
  let processed = 0;
  
  files.forEach(file => {
    if (!file.type.startsWith('image/')) {
      alert('⚠️ Solo se permiten archivos de imagen');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
      gallery.push(event.target.result);
      localStorage.setItem('boshGallery', JSON.stringify(gallery));
      
      processed++;
      if (processed === files.length) {
        currentIndex = gallery.length - 1;
        renderCarousel();
        showNotification(`✅ ${files.length} imagen(es) añadida(s) a la galería`);
      }
    };
    reader.readAsDataURL(file);
  });
  
  e.target.value = '';
});

prevImg?.addEventListener('click', function() {
  if (gallery.length === 0) return;
  currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
  renderCarousel();
});

nextImg?.addEventListener('click', function() {
  if (gallery.length === 0) return;
  currentIndex = (currentIndex + 1) % gallery.length;
  renderCarousel();
});

clearGallery?.addEventListener('click', function() {
  if (!confirm('⚠️ ¿Estás seguro de borrar todas las imágenes de la galería?')) return;
  
  gallery = [];
  currentIndex = 0;
  localStorage.removeItem('boshGallery');
  renderCarousel();
  showNotification('🗑️ Galería borrada exitosamente');
});

renderCarousel();

const rankTableBody = document.querySelector('#rankTable tbody');

function loadRank() {
  if (!rankTableBody) return;
  
  const rank = JSON.parse(localStorage.getItem('boshRank') || '[]')
    .sort((a, b) => b.score - a.score);
  
  rankTableBody.innerHTML = '';
  
  if (rank.length === 0) {
    rankTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#64748b;padding:20px;">No hay registros aún. ¡Sé el primero en participar!</td></tr>';
    return;
  }
  
  rank.forEach((r, i) => {
    const tr = document.createElement('tr');
    
    let medal = '';
    if (i === 0) medal = '🥇';
    else if (i === 1) medal = '🥈';
    else if (i === 2) medal = '🥉';
    
    const date = new Date(r.date);
    const formattedDate = date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    tr.innerHTML = `
      <td><strong>${medal} ${i + 1}</strong></td>
      <td>${r.name}</td>
      <td>${r.doc || '-'}</td>
      <td><span style="background:${r.type === 'Quiz' ? '#dbeafe' : '#fef3c7'};padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600;">${r.type === 'Quiz' ? '🎓 Quiz' : '🎮 Juego'}</span></td>
      <td><strong>${r.score}${r.type === 'Quiz' ? '%' : ' pts'}</strong></td>
      <td style="font-size:13px;color:#64748b;">${formattedDate}</td>
    `;
    rankTableBody.appendChild(tr);
  });
}

document.getElementById('clearRanking')?.addEventListener('click', function() {
  if (!confirm('⚠️ ¿Estás seguro de borrar todo el ranking? Esta acción no se puede deshacer.')) return;
  
  localStorage.removeItem('boshRank');
  loadRank();
  showNotification('🗑️ Ranking limpiado exitosamente');
});

loadRank();
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    z-index: 9999;
    font-weight: 600;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(styleSheet);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-4px)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

console.log('✅ Sistema PESV BOSHMANY iniciado correctamente');