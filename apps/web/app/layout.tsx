 import Providers from "./providers";

 export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.css" integrity="sha512-kJlvECunwXftkPwyvHbclArO8wszgBGisiLeuDFwNM8ws+wKIw0sv1os3ClWZOcrEB2eRXULYUsm8OVRGJKwGA==" />
        </head>
       <body>
      <Providers>
               {children}
      </Providers>
      </body>
    </html>
  );
}