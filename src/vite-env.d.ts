/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Endpoint that receives contact-form enquiries (POST, JSON body).
   * When it is unset or unreachable the form falls back to a mailto: link.
   * See src/lib/enquiry.ts.
   */
  readonly VITE_FORM_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
