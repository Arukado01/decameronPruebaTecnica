import Swal from "sweetalert2";
import confetti from "canvas-confetti";

export async function swalError(message: string) {
    await Swal.fire({
        icon: "error",
        title: "¡Ops!",
        text: message,
        confirmButtonColor: "#d33",
    });
}

export async function swalSuccess(message: string) {
    await Swal.fire({
        icon: "success",
        title: "Éxito",
        text: message,
        confirmButtonColor: "#145388",
    });
    /* confetti.js al cerrar */
    confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
    });
}

export async function swalConfirm(text: string): Promise<boolean> {
    const res = await Swal.fire({
        icon: "question",
        title: "¿Estás seguro?",
        text,
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
    });
    return res.isConfirmed;
}
