'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simular envío (aquí podrías integrar con un servicio real)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    alert('¡Mensaje enviado! Te responderemos pronto.')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-lg px-4 py-2 border-purple-500/30 text-purple-300">
            Contacto
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Contáctanos
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            ¿Tienes preguntas, sugerencias o quieres colaborar? ¡Nos encantaría escucharte!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-black/20 border border-purple-500/20 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Envíanos un Mensaje</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-black/50 border-purple-500/30 text-gray-300 placeholder-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-black/50 border-purple-500/30 text-gray-300 placeholder-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Asunto
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="bg-black/50 border-purple-500/30 text-gray-300 placeholder-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20"
                  placeholder="¿En qué podemos ayudarte?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Mensaje
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-black/50 border-purple-500/30 text-gray-300 placeholder-gray-500 focus:border-purple-500/50 focus:ring-purple-500/20 resize-none"
                  placeholder="Cuéntanos más sobre tu consulta..."
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 text-white"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enviando...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Enviar Mensaje</span>
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-black/20 border border-purple-500/20 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Información de Contacto</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-0.5">
                    <div className="w-full h-full rounded-lg bg-black flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email</h3>
                    <p className="text-gray-400">contacto@cybercodigo.com</p>
                    <p className="text-sm text-gray-500">Respondemos en 24 horas</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-0.5">
                    <div className="w-full h-full rounded-lg bg-black flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Teléfono</h3>
                    <p className="text-gray-400">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Lun-Vie 9:00-18:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 p-0.5">
                    <div className="w-full h-full rounded-lg bg-black flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Ubicación</h3>
                    <p className="text-gray-400">Ciudad Tecnológica, CA 90210</p>
                    <p className="text-sm text-gray-500">Estados Unidos</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/20 border border-purple-500/20 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">¿Por qué Contactarnos?</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                  <span>Sugerencias para mejorar el blog</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                  <span>Colaboraciones y guest posts</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                  <span>Reportar errores técnicos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                  <span>Consultas sobre contenido</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mt-2"></span>
                  <span>Oportunidades de negocio</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
