import Link from "next/link";

export default function Home() {
     return (
          <main>
               show photo
               <br />
               <Link href="/upload" className="underline">
                    Upload Image Cloudinary
               </Link>
          </main>
     );
}
