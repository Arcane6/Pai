function gerarPDF() {
    // Seleciona o elemento que contém todo o formulário
    const elemento = document.getElementById('conteudo-ficha');

    // Pega a data atual para o nome do arquivo
    const dataAtual = new Date().toISOString().slice(0, 10);
    const nomeArquivo = `ficha_sinan_${dataAtual}.pdf`;

    // Configurações do html2pdf
    const opcoes = {
        margin:       [10, 10, 10, 10], // Margens (Topo, Esq, Baixo, Dir) em mm
        filename:     nomeArquivo,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, // Melhora a resolução
            logging: true, 
            useCORS: true, // Importante se houver imagens externas
            // Esta opção ajuda a capturar os valores dos inputs corretamente
            onclone: (documentoClonado) => {
                // Força a renderização visual dos selects e inputs no canvas
                const inputs = documentoClonado.querySelectorAll('input');
                inputs.forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        if (input.checked) input.setAttribute('checked', 'checked');
                    } else {
                        input.setAttribute('value', input.value);
                    }
                });
                
                const selects = documentoClonado.querySelectorAll('select');
                selects.forEach(select => {
                    const selectedOption = select.options[select.selectedIndex];
                    if(selectedOption) {
                        selectedOption.setAttribute('selected', 'selected');
                    }
                });
            }
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Esconde o botão momentaneamente (dupla segurança além do CSS)
    const btn = document.querySelector('.btn-primary');
    btn.style.display = 'none';

    // Gera o PDF
    html2pdf().set(opcoes).from(elemento).save().then(() => {
        // Mostra o botão novamente após o download iniciar
        btn.style.display = 'block';
    });
}
