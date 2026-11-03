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
  setSelectedStudent: Dispatch<SetStateAction<StudentRecordType | null>>;
}

export default function StudentManagementTabs({
  setSearchTerm,
  statusMessage,
  setIsOpen,
  filteredStudents,
  searchTerm,
  setSelectedStudent,
}: StudentManagementTabsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="search-student">
        <TabsList className="h-auto">
          <TabsTrigger
            value="search-student"
            className="gap-2 px-4 py-2 text-lg font-bold"
          >
            <Search className="size-5" aria-hidden="true" />
            Buscar aluno
          </TabsTrigger>
          <TabsTrigger
            value="register-student"
            className="gap-2 px-4 py-2 text-lg font-bold"
          >
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
