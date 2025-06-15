import MultiStepFormNew from "@/components/MultiStepFormNew";
import {Navbar} from "@/components/NavbarComponent";
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" mx-auto">
       
        <Navbar />
        <MultiStepFormNew />
      </div>
    </div>
  );
}