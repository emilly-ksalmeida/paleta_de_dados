import type { Dispatch, SetStateAction } from "react";

import { StudentSearchArea } from "@/components/StudentSearchArea";
import { StudentSearchResults } from "@/components/StudentSearchResults";
import type { StudentRecordType } from "@/types/studentRecordType";

interface StudentSearchTabProps {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  statusMessage: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  filteredStudents?: StudentRecordType[];
  searchTerm: string;
  selectedStudent: StudentRecordType | null;
  setSelectedStudent: Dispatch<SetStateAction<StudentRecordType | null>>;
}

export function StudentSearchTab({
  setSearchTerm,
  statusMessage,
  setIsOpen,
  filteredStudents,
  searchTerm,
  selectedStudent,
  setSelectedStudent,
}: StudentSearchTabProps) {
  return (
    <div className="flex flex-col gap-5">
      <StudentSearchArea
        setSearchTerm={setSearchTerm}
        statusMessage={statusMessage}
        setIsOpen={setIsOpen}
      />

      <StudentSearchResults
        filteredStudents={filteredStudents}
        searchTerm={searchTerm}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
      />
    </div>
  );
}
