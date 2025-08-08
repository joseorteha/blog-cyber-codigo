import { Badge } from '@/components/ui/badge'

export default function TermsPage() {
  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-4 py-2 border-purple-500/30 text-purple-300">
            Términos y Condiciones
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Términos y Condiciones
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Condiciones de uso de Cyber Código
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="bg-black/20 border border-purple-500/20 rounded-xl p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Aceptación de los Términos</h2>
              <p className="text-gray-300 leading-relaxed">
                Al acceder y utilizar Cyber Código, aceptas estar sujeto a estos términos y condiciones. 
                Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Uso del Servicio</h2>
              <p className="text-gray-300 leading-relaxed">
                Cyber Código es un blog de tecnología que proporciona contenido educativo e informativo. 
                Te comprometes a:
              </p>
              <ul className="text-gray-300 mt-4 space-y-2">
                <li>• Utilizar el servicio solo para fines legales</li>
                <li>• No infringir derechos de propiedad intelectual</li>
                <li>• No intentar acceder a áreas restringidas del sistema</li>
                <li>• No enviar contenido malicioso o spam</li>
                <li>• Respetar a otros usuarios y sus comentarios</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contenido del Usuario</h2>
              <p className="text-gray-300 leading-relaxed">
                Al publicar comentarios o contenido en Cyber Código:
              </p>
              <ul className="text-gray-300 mt-4 space-y-2">
                <li>• Mantienes la propiedad de tu contenido</li>
                <li>• Nos otorgas licencia para mostrarlo en el sitio</li>
                <li>• Eres responsable del contenido que publicas</li>
                <li>• No debes publicar contenido ofensivo o inapropiado</li>
                <li>• Podemos moderar o eliminar contenido que viole nuestras políticas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Propiedad Intelectual</h2>
              <p className="text-gray-300 leading-relaxed">
                Todo el contenido original de Cyber Código, incluyendo textos, imágenes, diseño y código, 
                está protegido por derechos de autor. No puedes reproducir, distribuir o crear obras derivadas 
                sin nuestro permiso expreso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Limitación de Responsabilidad</h2>
              <p className="text-gray-300 leading-relaxed">
                Cyber Código se proporciona "tal como está" sin garantías de ningún tipo. No somos responsables 
                por daños directos, indirectos, incidentales o consecuentes que puedan resultar del uso de nuestro servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Modificaciones</h2>
              <p className="text-gray-300 leading-relaxed">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán 
                en vigor inmediatamente después de su publicación en el sitio. Es tu responsabilidad revisar 
                periódicamente estos términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contacto</h2>
              <p className="text-gray-300 leading-relaxed">
                Si tienes preguntas sobre estos términos y condiciones, contáctanos a través de nuestra página de contacto.
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-purple-500/20">
              <p className="text-sm text-gray-400">
                <strong>Última actualización:</strong> {new Date().toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
