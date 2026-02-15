// St. Patrick's Day Decorator
class StPatrickDecorator {
    constructor() {
        this.container = document.getElementById('cloverContainer');
        this.decorationZone = document.getElementById('decorationZone');
        this.svg = document.getElementById('cloverSvg');
        this.decorations = [];
        this.selectedDecoration = null;
        this.draggedElement = null;
        this.settings = { size: 1 };
        this.init();
    }
    
    init() {
        this.setupDragAndDrop();
        this.setupControls();
        this.setupInteractions();
    }
    
    setupDragAndDrop() {
        const items = document.querySelectorAll('.decoration-item');
        
        items.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedElement = e.target;
                e.dataTransfer.effectAllowed = 'copy';
            });
            
            item.addEventListener('click', () => {
                const rect = this.decorationZone.getBoundingClientRect();
                this.addDecoration(item.dataset.type, rect.width / 2, rect.height / 2);
            });
        });
        
        this.decorationZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });
        
        this.decorationZone.addEventListener('drop', (e) => {
            e.preventDefault();
            if (this.draggedElement) {
                const rect = this.decorationZone.getBoundingClientRect();
                this.addDecoration(this.draggedElement.dataset.type, e.clientX - rect.left, e.clientY - rect.top);
            }
        });
    }
    
    addDecoration(type, x, y) {
        const el = document.createElement('div');
        el.className = 'decoration';
        el.dataset.type = type;
        
        const emojis = {
            'clover': '🍀', 'four-leaf': '☘️', 'shamrock': '🌿',
            'pot': '🫕', 'coin': '🪙', 'rainbow': '🌈',
            'leprechaun': '🎩', 'beer': '🍺', 'flag': '🇮🇪',
            'sparkle': '✨', 'star': '⭐', 'heart': '💚'
        };
        
        el.textContent = emojis[type] || '🍀';
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        
        this.makeDraggable(el);
        
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectDecoration(el);
        });
        
        el.addEventListener('dblclick', () => {
            el.remove();
            this.decorations = this.decorations.filter(d => d !== el);
        });
        
        this.decorationZone.appendChild(el);
        this.decorations.push(el);
    }
    
    makeDraggable(element) {
        let isDragging = false, initialX, initialY;
        
        element.addEventListener('mousedown', (e) => {
            if (e.target === element || element.contains(e.target)) {
                isDragging = true;
                element.classList.add('dragging');
                initialX = e.clientX - element.offsetLeft;
                initialY = e.clientY - element.offsetTop;
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                const rect = this.decorationZone.getBoundingClientRect();
                let cx = Math.max(0, Math.min(e.clientX - initialX, rect.width - 40));
                let cy = Math.max(0, Math.min(e.clientY - initialY, rect.height - 40));
                element.style.left = cx + 'px';
                element.style.top = cy + 'px';
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.classList.remove('dragging');
            }
        });
    }
    
    selectDecoration(el) {
        if (this.selectedDecoration) this.selectedDecoration.classList.remove('selected');
        this.selectedDecoration = el;
        el.classList.add('selected');
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' && this.selectedDecoration) {
                this.selectedDecoration.remove();
                this.decorations = this.decorations.filter(d => d !== this.selectedDecoration);
                this.selectedDecoration = null;
            }
        }, { once: true });
    }
    
    setupControls() {
        const slider = document.getElementById('size');
        const value = document.getElementById('sizeValue');
        
        slider.addEventListener('input', (e) => {
            this.settings.size = parseFloat(e.target.value);
            value.textContent = Math.round(this.settings.size * 100) + '%';
            this.svg.style.transform = `scale(${this.settings.size})`;
        });
        
        document.getElementById('clearBtn').addEventListener('click', () => {
            if (confirm('Clear all?')) {
                this.decorations.forEach(d => d.remove());
                this.decorations = [];
            }
        });
        
        document.getElementById('exportBtn').addEventListener('click', () => this.export());
    }
    
    setupInteractions() {
        this.decorationZone.addEventListener('click', (e) => {
            if (e.target === this.decorationZone && this.selectedDecoration) {
                this.selectedDecoration.classList.remove('selected');
                this.selectedDecoration = null;
            }
        });
    }
    
    export() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 800;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, 800, 800);
        
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.ellipse(400, 600, 200, 50, 0, 0, Math.PI * 2);
        ctx.fill();
        
        this.decorations.forEach(dec => {
            const rect = dec.getBoundingClientRect();
            const zoneRect = this.decorationZone.getBoundingClientRect();
            const x = (rect.left - zoneRect.left) * (800 / zoneRect.width);
            const y = (rect.top - zoneRect.top) * (800 / zoneRect.height);
            ctx.font = '40px Arial';
            ctx.fillText(dec.textContent, x, y);
        });
        
        canvas.toBlob((blob) => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'st-patrick-decorator.png';
            a.click();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new StPatrickDecorator());
