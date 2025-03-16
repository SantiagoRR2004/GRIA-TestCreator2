import tkinter as tk
from tkinter import filedialog, messagebox
from UTILS import exam


def start_exam_generation():
    folder = folder_path.get()
    num_exams = int(num_exams_entry.get())
    num_questions = int(num_questions_entry.get())
    questions_per_topic = None

    if questions_per_topic_var.get():
        topics_input = questions_per_topic_entry.get()
        try:
            # Convertir entrada en diccionario {tema: cantidad}
            questions_per_topic = {
                k.strip(): int(v.strip())
                for k, v in (item.split(":") for item in topics_input.split(","))
            }
        except ValueError:
            messagebox.showerror(
                "Error",
                "Formato incorrecto en 'Questions per topic'. Usa 'tema1:cantidad1, tema2:cantidad2'.",
            )
            return

    if folder and num_exams > 0 and num_questions > 0:
        try:
            exam.examGenerator(folder, num_exams, num_questions, questions_per_topic)
            status_label.config(text="Examen generado exitosamente.")
        except KeyError as e:
            messagebox.showerror(
                "Error",
                f"El tema '{e.args[0]}' no coincide con ningún archivo en la carpeta.",
            )
        except Exception as e:
            messagebox.showerror("Error inesperado", str(e))
    else:
        status_label.config(text="Por favor, ingrese valores válidos.")


def select_folder():
    path = filedialog.askdirectory()
    folder_path.set(path)


def toggle_questions_per_topic():
    """Habilita o deshabilita el campo de 'Questions per topic' según el checkbox."""
    state = tk.NORMAL if questions_per_topic_var.get() else tk.DISABLED
    questions_per_topic_entry.config(state=state)


# Configuración de la ventana
root = tk.Tk()
root.title("Generador de Exámenes")

folder_path = tk.StringVar()

tk.Label(root, text="Seleccione la carpeta de preguntas:").pack()
tk.Entry(root, textvariable=folder_path, width=50).pack()
tk.Button(root, text="Buscar", command=select_folder).pack()

tk.Label(root, text="Número de exámenes:").pack()
num_exams_entry = tk.Entry(root)
num_exams_entry.pack()
num_exams_entry.insert(0, "1")

tk.Label(root, text="Número de preguntas por examen:").pack()
num_questions_entry = tk.Entry(root)
num_questions_entry.pack()
num_questions_entry.insert(0, "10")

# Checkbox para activar "Questions per topic"
questions_per_topic_var = tk.BooleanVar()
questions_per_topic_checkbox = tk.Checkbutton(
    root,
    text="Usar 'Questions per topic'",
    variable=questions_per_topic_var,
    command=toggle_questions_per_topic,
)
questions_per_topic_checkbox.pack()

# Campo de entrada para "Questions per topic"
questions_per_topic_entry = tk.Entry(root, state=tk.DISABLED, width=50)
questions_per_topic_entry.pack()
questions_per_topic_entry.insert(0, "tema1:3, tema2:5")

tk.Button(root, text="Generar Examen", command=start_exam_generation).pack()

status_label = tk.Label(root, text="")
status_label.pack()

root.mainloop()
