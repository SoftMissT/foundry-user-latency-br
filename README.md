# Latência dos Usuários

> Fork brasileiro do User Latency, compatível com Foundry VTT v13 e verificado para v14.

O módulo exibe a latência média de cada usuário ao lado do nome na lista de jogadores. No Foundry VTT v14, ele reutiliza a medição nativa de latência e compartilha somente o valor necessário entre os clientes conectados.

<p align="center">
  <img src="https://i.imgur.com/bytsMWS.png" alt="Latência exibida na lista de jogadores do Foundry VTT" />
</p>

## Instalação

Cole o endereço abaixo em **Instalar módulo** no Foundry VTT:

```text
https://raw.githubusercontent.com/SoftMissT/foundry-user-latency-br/main/module.json
```

Depois, ative **Latência dos Usuários** nas configurações de módulos do seu mundo.

## Configurações

Em **Configurações do jogo → Configurar ajustes → Configurações de módulo**, o Mestre pode:

- definir o intervalo de atualização entre 10 e 90 segundos;
- ocultar completamente os valores;
- mostrar apenas indicadores coloridos em vez dos números.

## Compatibilidade

- Foundry VTT mínimo: v13
- Foundry VTT verificado: v14
- Sistemas de jogo: independente de sistema

## Desenvolvimento

```bash
npm install
npm test
npm run package
```

O comando `npm run package` cria `module.zip` com `module.json` diretamente na raiz do pacote.

## Créditos

Projeto original criado por [mawburn](https://github.com/mawburn/foundry-user-latency). Este fork é mantido por [SoftMissT](https://github.com/SoftMissT) para compatibilidade com as versões atuais do Foundry VTT e localização em português brasileiro.

O projeto original foi arquivado enquanto a funcionalidade era discutida para integração ao núcleo do Foundry VTT: [foundryvtt/foundryvtt#11132](https://github.com/foundryvtt/foundryvtt/issues/11132).

Distribuído sob a licença [GNU AGPL v3](LICENSE).
