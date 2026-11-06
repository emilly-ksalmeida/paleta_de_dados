import type { Dispatch, SetStateAction } from "react";
import { Search, UserPlus } from "lucide-react";

import { StudentRegistrationTab } from "@/components/StudentRegistrationTab";
import { StudentSearchTab } from "@/components/StudentSearchTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { StudentRecordType } from "@/types/studentRecordType";

interface StudentManagementTabsProps {
  setSearchTerm: Dispatch<SetStateAction<string>>;
  statusMessage: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  filteredStudents?: StudentRecordType[];
  searchTerm: string;
  selectedStudent: StudentRecordType | null;
  setSelectedStudent: Dispatch<SetStateAction<StudentRecordType | null>>;
}

const TAB_TRIGGER_CLASS =
  "gap-2 border border-transparent px-4 py-2 text-lg font-bold focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:underline focus-visible:underline-offset-4 data-[state=active]:border-primary/30 data-[state=active]:bg-primary/10 data-[state=active]:text-brand-header";

export default function StudentManagementTabs({
  setSearchTerm,
  statusMessage,
  setIsOpen,
  filteredStudents,
  searchTerm,
  selectedStudent,
  setSelectedStudent,
}: StudentManagementTabsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="search-student">
        <TabsList className="h-auto" aria-label="Gerenciamento de alunos">
          <TabsTrigger value="search-student" className={TAB_TRIGGER_CLASS}>
            <Search className="size-5" aria-hidden="true" />
            Buscar aluno
          </TabsTrigger>
          <TabsTrigger value="register-student" className={TAB_TRIGGER_CLASS}>
            <UserPlus className="size-5" aria-hidden="true" />
            Cadastrar aluno
          </TabsTrigger>
        </TabsList>
        <TabsContent value="search-student">
          <StudentSearchTab
            setSearchTerm={setSearchTerm}
            statusMessage={statusMessage}
            setIsOpen={setIsOpen}
            filteredStudents={filteredStudents}
            searchTerm={searchTerm}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
          />
        </TabsContent>
        <TabsContent value="register-student">
          <StudentRegistrationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
