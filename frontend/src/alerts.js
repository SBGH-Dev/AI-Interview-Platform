import Swal from "sweetalert2";

export function showSuccessAlert(message) {
  return Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
  });
}

export function showErrorAlert(message) {
  return Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
  });
}
