import { Badge } from '@/components/ui/badge'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-4 py-2 border-purple-500/30 text-purple-300">
            Política de Privacidad
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Política de Privacidad
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Cómo protegemos y utilizamos tu información personal
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <div className="bg-black/20 border border-purple-500/20 rounded-xl p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Información que Recopilamos</h2>
              <p className="text-gray-300 leading-relaxed">
                Recopilamos información que nos proporcionas directamente, como cuando creas una cuenta, 
                te suscribes a nuestro newsletter o nos contactas. Esto puede incluir:
              </p>
              <ul className="text-gray-300 mt-4 space-y-2">
                <li>• Nombre y dirección de correo electrónico</li>
                <li>• Información de perfil y preferencias</li>
                <li>• Comentarios y contenido que compartes</li>
                <li>• Información de uso y análisis</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Cómo Utilizamos tu Información</h2>
              <p className="text-gray-300 leading-relaxed">
                Utilizamos tu información para:
              </p>
              <ul className="text-gray-300 mt-4 space-y-2">
                <li>• Proporcionar y mejorar nuestros servicios</li>
                <li>• Personalizar tu experiencia en el blog</li>
                <li>• Enviar newsletters y actualizaciones</li>
                <li>• Responder a tus consultas y comentarios</li>
                <li>• Analizar el uso del sitio para mejoras</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Protección de Datos</h2>
              <p className="text-gray-300 leading-relaxed">
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger 
                tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Tus Derechos</h2>
              <p className="text-gray-300 leading-relaxed">
                Tienes derecho a:
              </p>
              <ul className="text-gray-300 mt-4 space-y-2">
                <li>• Acceder a tu información personal</li>
                <li>• Corregir información inexacta</li>
                <li>• Solicitar la eliminación de tus datos</li>
                <li>• Oponerte al procesamiento de tus datos</li>
                <li>• Retirar tu consentimiento en cualquier momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contacto</h2>
              <p className="text-gray-300 leading-relaxed">
                Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tu información, 
                no dudes en contactarnos a través de nuestra página de contacto.
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
