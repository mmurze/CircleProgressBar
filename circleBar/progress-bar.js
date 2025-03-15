class ProgressBar extends HTMLElement {
  constructor() {
    super();
    this.value = parseInt(this.getAttribute("value")) || 0;
    this.animated = this.getAttribute("animated") === "true";
    this.hide = this.getAttribute("hide") === "true";

    this.radius = parseInt(this.getAttribute("radius")) || 60;
    this.width = parseInt(this.getAttribute("width")) || 7;

    this.veiwBox = this.radius * 2;
    this.normalisedRadius = this.radius - this.width;

    this.circumference = 0;
    this.progress = 0;

    this.render();
  }

  set circumference(newValue) {}
  get circumference() {
    return 2 * Math.PI * this.normalisedRadius;
  }

  set progress(newValue) {}
  get progress() {
    return (this.value / 100) * this.circumference;
  }

  render() {
    this.innerHTML = `
            <div 
                id="circle-progress-bar" 
                class="circle-progress-bar ${this.hide ? "hidden" : ""}"
             >
                <svg 
                    fill="none" 
                    width="${this.veiwBox}" 
                    height="${this.veiwBox}" 
                    viewBox="0 0 ${this.veiwBox} ${this.veiwBox}"
                    focusable="false"
                >
                    <circle 
                        cx="${this.radius} " 
                        cy="${this.radius}  " 
                        r="${this.normalisedRadius}" 
                        stroke="lightgray"  
                        stroke-width="${this.width}" 
                        fill="none"
                    />
                    <circle 
                        id="circle-progress" 
                        cx="${this.radius}" 
                        cy="${this.radius}" 
                        r="${this.normalisedRadius}"   
                        stroke="#005bff" 
                        stroke-width="${this.width}" 
                        fill="none"
                        stroke-dasharray="${this.circumference}" 
                        stroke-dashoffset="${
                          this.circumference - this.progress
                        }"
                        class="${this.animated ? "animated" : ""}"
                    />
                </svg>
            </div>
        `;

    const circle = this.querySelector("#circle-progress-bar");
    circle.style.width = `${this.veiwBox}px`;
    circle.style.height = `${this.veiwBox}px`;
  }

  updateProgress() {
    const circle = this.querySelector("#circle-progress");

    if (circle) {
      circle.style.strokeDashoffset = this.circumference - this.progress;
    }
  }

  static get observedAttributes() {
    return ["value", "animated", "hide", "width", "radius"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;

    switch (name) {
      case "value": {
        this.value = parseInt(newValue);
        break;
      }
      case "animated": {
        this.animated = newValue === "true";
        const circle = this.querySelector("#circle-progress");

        if (circle) circle.classList.toggle("animated", this.animated);
        break;
      }
      case "hide": {
        this.hide = newValue === "true";
        const container = this.querySelector("#circle-progress-bar");

        if (container) container.classList.toggle("hidden", this.hide);
        break;
      }
    }

    this.updateProgress();
  }
}

customElements.define("progress-bar", ProgressBar);
