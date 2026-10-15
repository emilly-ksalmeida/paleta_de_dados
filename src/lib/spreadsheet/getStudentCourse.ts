import type { SpreadsheetStudentType } from "@/types/spreadsheetStudentType";

type couserClassType = {
  studentCourse: string;
  studentClass: string;
};
export default function getStudentCourseClass(
  student: SpreadsheetStudentType | null,
): couserClassType {
  if (!student) {
    return {
      studentCourse: "",
      studentClass: "",
    };
  }
  const courseColumnAliases = [
    student.dia_semana_prep1,
    student.dia_semana_prep2,
    student.cursos_disponiveis,
    student.curso_noturno,
  ];
  const classColumnAliases = [
    student.escolha_o_turno,
    student.escolha_o_turno_2,
    student.dia_semana_regular,
    student.dia_semana_regular_2,
  ];

  const studentCourse =
    courseColumnAliases.find((value) => value?.trim())?.trim() ?? "";
  const studentClass =
    classColumnAliases.find((value) => value?.trim())?.trim() ?? "";

  return {
    studentCourse,
    studentClass,
  };
}
