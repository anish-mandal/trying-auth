/**
 * Used to create toast
 * @class Toast
 */
class Toast {
  /**
   * @constructor
   */
  constructor() {
    let previousToast = document.getElementsByClassName("toast");
    if (!(previousToast.length === 0)) {
      this.toast = previousToast[0];
    } else {
      let toast = document.createElement("div");
      toast.classList.add("toast");
      document.body.append(toast);
      this.toast = toast;
    }
  }

  success(message) {
    this.toast.innerText = message;
    this.toast.style.border = "2px solid green";
    this.toast.style.borderRadius = "20px";
    this.toast.style.top = "10px";
    setTimeout(() => {
      this.toast.style.top = "-100%";
    }, 5000);
  }
}
