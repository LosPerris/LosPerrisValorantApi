export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-10] bg-[#050505]">
      
      {/* Patrón de cuadrícula técnico, súper nítido y limpio con animación de respiración */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.8) 1px, transparent 1px),
            linear-gradient(to right, rgba(255,70,85,0.15) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(0,0,0,0.8) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,70,85,0.15) 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px',
          backgroundPosition: 'center center'
        }}
      />
      
      {/* Suave degradado negro arriba y abajo para que la cuadrícula se funda elegantemente */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />

    </div>
  );
}
