export default function Parcerias() {
  return (
    <>
      <div className="py-10">
        <div className="max-w-4xl mx-auto gray shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Parcerias com a Promo Zone</h1>
          <p className="mb-4">
            Se você deseja estabelecer uma parceria com o grupo de promoções "Promo Zone", entre em contato conosco pelo
            e-mail:
            <a href="mailto:igor.oliveira.contact2210@gmail.com" className="text-blue-500">
              {" "}
              igor.oliveira.contact2210@gmail.com
            </a>
            . Estamos abertos a colaborações que agreguem valor aos nossos clientes e parceiros.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4">Como funciona a parceria?</h2>
          <ol className="list-decimal list-inside mb-4">
            <li>
              <strong>Envio de Proposta:</strong> Envie um e-mail para{" "}
              <a href="mailto:igor.oliveira.contact2210@gmail.com" className="text-blue-500">
                igor.oliveira.contact2210@gmail.com
              </a>{" "}
              com detalhes sobre sua empresa e a proposta de parceria.
            </li>
            <li>
              <strong>Análise da Proposta:</strong> Nossa equipe avaliará sua proposta e entrará em contato para discutir
              possíveis formas de colaboração.
            </li>
            <li>
              <strong>Definição de Estratégias:</strong> Juntos, desenvolveremos estratégias que beneficiem ambas as partes e
              atendam às expectativas do público.
            </li>
            <li>
              <strong>Implementação:</strong> Após alinharmos os detalhes, iniciaremos a parceria conforme o planejamento
              estabelecido.
            </li>
          </ol>
          <p className="mt-6">
            Estamos ansiosos para construir parcerias sólidas e bem-sucedidas. Junte-se à Promo Zone e amplie as
            oportunidades de crescimento para o seu negócio!
          </p>
        </div>
      </div>
    </>
  );
}
