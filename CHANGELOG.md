# Changelog

## 0.1.0-alpha.10 (2026-02-10)

Full Changelog: [v0.1.0-alpha.9...v0.1.0-alpha.10](https://github.com/dedalus-labs/dedalus-sdk-typescript/compare/v0.1.0-alpha.9...v0.1.0-alpha.10)

### ⚠ BREAKING CHANGES

* **mcp:** remove deprecated tool schemes
* **mcp:** **Migration:** To migrate, simply modify the command used to invoke the MCP server. Currently, the only supported tool scheme is code mode. Now, starting the server with just `node /path/to/mcp/server` or `npx package-name` will invoke code tools: changing your command to one of these is likely all you will need to do.

### Features

* **api:** add endpoints ([f76b925](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f76b9258e7e232eee002ab387f54b69ae71040fd))
* **api:** add endpoints ([48fe852](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/48fe85202cdbc3697daa0e7c14b8b4c523202736))
* **api:** add streaming ([e188e04](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e188e04047defdb5b85e4b1a49b28dce8793772c))
* **api:** add streaming configuration ([ff8bac6](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ff8bac6f034626ddd6fbed21d3117472a6cff1a4))
* **api:** adjust parameters ([8a91533](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/8a91533602d6aa391a1ef506992ae00215a82f6d))
* **api:** api update ([a6576c3](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a6576c3169abb6a5b42ee130f69818a1004e2675))
* **api:** api update ([4722f77](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4722f77eab82382374594b0482ce891aa7dcf5c0))
* **api:** api update ([94ba5c1](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/94ba5c13bf4af0758211469be9e4c88e7fe03126))
* **api:** api update ([4f2d043](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4f2d0435105eb48c6281335b2e9203b1236445b6))
* **api:** api update ([86bd375](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/86bd3757f5c0a09107d168be798e082aac04ce45))
* **api:** api update ([568bc3a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/568bc3a55e5d2591a20071ba51c94c26c04e9b88))
* **api:** api update ([347ada6](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/347ada6a111d7a47be830a1585fa0805d44cd797))
* **api:** api update ([dc61e7a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/dc61e7aff089db86a5784b981d3bec8ec00fecf8))
* **api:** api update ([5967ce0](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5967ce0a93336b42b672e6e73475828d04fd5a22))
* **api:** api update ([3e37ce7](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/3e37ce75aa26ceb1bcfe3a999b106631ca91ae0e))
* **api:** api update ([86aeabb](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/86aeabb58030c9f81743055e1649c5c66a3ba628))
* **api:** api update ([6aed08c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6aed08ce0d145dcf6224c5e272d50ab2710b5c4f))
* **api:** api update ([c9ccd5a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c9ccd5a7e92dffe4d92a7e07ebb631fb5b7882c2))
* **api:** auto exec tools ([2dc1d78](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/2dc1d78730353c05b8920929ba7371dad9c508c2))
* **api:** chat completions ([8e28a07](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/8e28a0722055a0bb476f73a5ca75291182e02b51))
* **api:** config update for dedalus-ai/dev ([8c11861](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/8c118618ec69f55a087a043abee618119a0606d2))
* **api:** config update for dedalus-ai/dev ([0df93e2](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/0df93e22387cdec588897e8efb646c34abf5065b))
* **api:** Config update for dedalus-ai/dev ([9ca4792](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/9ca47923acbe8cc6ca766a9957d1cab41f8b09f3))
* **api:** decouple Model and DedalusModel ([5a1ddd1](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5a1ddd1f87670b0beec85f9010f27376f5d0c01a))
* **api:** dedalus model update ([99bd4df](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/99bd4dfb02aa2004d59e387b7e391706ded9cbb9))
* **api:** id-&gt;name in DedalusModel ([c05611a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c05611a838aa7c4f0d363da20ca725e25d56cca5))
* **api:** image support ([9e0db2d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/9e0db2d03fcbe0b03bb5975dd1f34fdb17e6d405))
* **api:** improve types ([c89f938](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c89f93841f70c84323ba6423be6b0f57e2ddf561))
* **api:** logic adj ([868d32b](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/868d32b51aee4ed66be548366aab65d2c97901c6))
* **api:** manual updates ([c892aa2](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c892aa2c3bdbc2a49adf27361ef66c5dd2701ac7))
* **api:** manual updates ([758631f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/758631f62a13459d24e76401f70f6fba385a78e1))
* **api:** manual updates ([fc8a369](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/fc8a3695ff4a5fdb8c0e9c569c2c10e8dffed041))
* **api:** mcp server params ([8c60036](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/8c60036fbf24faa8cb214d374b1ff3e870729305))
* **api:** messages param nullable ([254f9ef](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/254f9ef5397df901ddc8ac2b21e9ee3431f0c132))
* **api:** ModelConfig ([1201c05](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1201c056caae634a44bef2669f0af6e46ec6b19c))
* **api:** polished types ([f452201](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f452201bf28fa0590e2e46b57fbb00036dd9e9f9))
* **api:** response format ([765345e](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/765345eb89f6ca4528cf9a9554f1356afba7bec4))
* **api:** revert streaming for now ([c649f85](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c649f853cde2745cde926f9d5b0607bfd6afec60))
* **api:** schema compiler landed ([58cea7d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/58cea7d1d5b6c26ca8ef9601461a3cf2d86cc79a))
* **api:** spec concise ([19c1c44](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/19c1c44fe7e2e2b5781244b62e53a44c2ce0220b))
* **api:** standardize name casing with stainless initialism ([a295370](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a2953702f8c371cb7d8eaf60b92167c8a8926d97))
* **api:** streaming change ([088bd96](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/088bd9694cd8f5936b85e94d77ed7543135cd5c7))
* **api:** structured outputs ([76b74e5](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/76b74e502c94f3434c9dd6d3459594c1a50da539))
* **api:** to_schema and Model class ([acdf4b2](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/acdf4b2816be6372b6a489d6c15e277abb3bdb65))
* **api:** update types ([99536e8](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/99536e8120f332ca9b68eb9988bf4527b70a290c))
* **api:** update via SDK Studio ([a9c162d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a9c162d174c289c8394fe8d115c6464bad90b09c))
* **mcp:** add code execution tool ([d642b3b](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/d642b3b6f377b736f495f143468b1e4634f6b23f))
* **mcp:** add detail field to docs search tool ([f626d60](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f626d608160a127706832de7cffa19d96e686101))
* **mcp:** add docs search tool ([c84a5e0](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c84a5e0f59301851fb429f9580d1a57814fc3a06))
* **mcp:** add initial server instructions ([4f86ac3](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4f86ac33adbeee8409fc3a220d80d6d7b45779d7))
* **mcp:** add logging when environment variable is set ([5f554db](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5f554db9bb23ae303bf3e2d267661b3b6cd1de8d))
* **mcp:** add option for including docs tools ([4886db9](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4886db9126e19f846a3562b6aa9667f859bdc2ac))
* **mcp:** add option to infer mcp client ([2ee9508](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/2ee95089fdcc9605d0b9aae00ec66aa94bcb9c63))
* **mcp:** add typescript check to code execution tool ([024c566](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/024c5668e2f25b52976ba1f8fc3630db0a6d0597))
* **mcp:** allow setting logging level ([ed246b9](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ed246b9b3d3008a3e0952ed922fa4ec97f9591c9))
* **mcp:** enable experimental docs search tool ([27a07ae](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/27a07aea9ebcb46ab5b504b8e660ef4dc1028199))
* **mcp:** enable optional code execution tool on http mcp servers ([6f186fa](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6f186fa13482c0482c0654161f35d348571981e7))
* **mcp:** expose client options in `streamableHTTPApp` ([a033b07](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a033b07452ca178eca485e4f47639603f6fbc07e))
* **mcp:** handle code mode calls in the Stainless API ([5207502](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/52075024138a9341c20391f339c2f628a7dfb535))
* **mcp:** parse query string as mcp client options in mcp server ([ed28a00](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ed28a000ee0f10b6a104decbdb45b68c16a1594b))
* **mcp:** return logs on code tool errors ([0c59c13](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/0c59c13635e51387660f81e8290a42b26ac2ec15))
* **model:** add DedalusModel ([e0391a0](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e0391a04b6ae0fb590d64cb4cf871ac84163253c))
* **runner:** add type defns ([d87bda2](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/d87bda271da4ace957a1b2cd34d58ffa62bcd8ec))
* support for Effect schemas ([8a268fb](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/8a268fb557add7d2b12e18fa21505e45fa337110))
* **utils:** new util funcs ([51b9d14](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/51b9d14de98848a6ebe9470520bcf3d6f7f3061d))


### Bug Fixes

* **api:** add byok provider model ([d8db705](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/d8db705da7176f455ed11400fcbc37fd57d102fb))
* **api:** add shared DedalusModel type ([8f5e610](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/8f5e610e62af700cdfc2f3055fe5cadb2f6f9eed))
* **api:** add thought signature ([4564ccb](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4564ccb11385c0570266eee44798058d9f73fe48))
* **api:** default auth server ([3f2ef72](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/3f2ef72fd90bcb302a320a6320230652df52f52d))
* **api:** docstring truncation ([f184d22](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f184d224f2f1ac91f1f3a53acef766f62f776fc8))
* **api:** improve types ([4ab879e](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4ab879e3600a6ff079ea9c352912ec9b674e893d))
* **api:** mcp credential types ([e62afda](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e62afda0a3f4f2b14ea919362422d35327755ab7))
* **api:** merge origin/next and update types for new schema structure ([5e8a661](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5e8a66160f3caa143dff82175beae65b66da7f46))
* **api:** narrow types ([20c352d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/20c352dde4eb5b0a5d2baf0c7335d58281c21e75))
* **api:** typed json objects ([c69ac22](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c69ac222a3acc7f5446b54d97564287d414fc3cc))
* **api:** update types/docstrings ([d71015d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/d71015d924852028b9fafee6d7cf0bc9c24c5a64))
* **ci:** set permissions for DXT publish action ([ea94670](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ea94670575f5ea2298f307f63b3dd76d0237e33f))
* **client:** avoid memory leak with abort signals ([700888e](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/700888e1cf97f740e27dfe2e452f913a27522612))
* **client:** avoid removing abort listener too early ([4cc1c31](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4cc1c31ba8f3126ba5ba3de19c6e9b2e1c4654c2))
* coerce nullable values to undefined ([3d400a7](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/3d400a7dd40b057624cd1ffc7d2de5aab4a0476c))
* **docs:** fix mcp installation instructions for remote servers ([4a3480d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4a3480dac703db7b2d69994b9285578334d3a6ea))
* **mcp:** add client instantiation options to code tool ([42dcae2](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/42dcae291dd96814dc9f011f04101ede35a7622c))
* **mcp:** allow falling back for required env variables ([f06717c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f06717c74c5e66d60338a99ca6a24306b94e792e))
* **mcp:** avoid importing unsupported libraries on non-node environments ([e21c04e](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e21c04e1441788cb346eaa61cd0b8c030eaea534))
* **mcp:** avoid sending `jq_filter` to base API ([b41959f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/b41959fbc2099bad8e81a90a52aaf7e8eef0cb1b))
* **mcpb:** pin @anthropic-ai/mcpb version ([779f76d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/779f76d17c1566ad68fb6fcb4227e72da35fafe6))
* **mcp:** correct code tool API endpoint ([610456d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/610456d624c5e6409392bd50df2221a7ed97552f))
* **mcp:** correct code tool api output types ([2ea93db](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/2ea93dbea0682b8b692678a14936fb01b7c716aa))
* **mcp:** do not fallback on baseUrl if environment env variable is set ([15cb7cf](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/15cb7cf89b46943a87d00b7765aff18589cd07cc))
* **mcp:** fix cli argument parsing logic ([d116c44](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/d116c44132e8ea3f25ea9bcd593c509d9d66bf0f))
* **mcp:** fix options parsing ([2a7dee1](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/2a7dee15a26d148a3cf5f631b85042b5fc3615fb))
* **mcp:** fix query options parsing ([6ec3b6f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6ec3b6fab4548ebbcc0f027b202fe0a8e14b5438))
* **mcp:** fix tool description of jq_filter ([5036dba](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5036dba016f7950947f83a88bdb4663a15ede10f))
* **mcp:** fix uploading dxt release assets ([c51827d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c51827dda5a8a0791da987b41033a76e7a16dc2c))
* **mcp:** generate additionalProperties=true for map schemas to avoid validation issues ([7ab6742](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7ab6742b3beb9d731cf72f97e1710cb7e17dba07))
* **mcp:** pass base url to code tool ([9856067](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/98560675c4a9e350b5b4e8b0d0e65991aa27654f))
* **mcp:** resolve a linting issue in server code ([ad8cd0a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ad8cd0aa38b784d7d9b61da3b3e15c912f9f6e02))
* **mcp:** return correct lines on typescript errors ([4e10642](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4e106423fa976e775f8d747b66514f1dd72eb294))
* **mcp:** return tool execution error on jq failure ([734dc43](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/734dc432f4ca1bd445c9fb7c9283f5c7b09cc01b))
* **mcp:** reverse validJson capability option and limit scope ([eca5383](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/eca53838dff4fd099e71f72b309532f47ea74331))
* **mcp:** update code tool prompt ([150ddaf](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/150ddaf5925d51e4bdf41ff45866321cdd84a1e0))
* **mcp:** use raw responses for binary content ([caebbe8](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/caebbe8310be50666c96f45521e3b86f3fc145c8))


### Performance Improvements

* faster formatting ([5122ffe](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5122ffe8a154907d3d7727f0f07885e92dbc8134))


### Chores

* add .env files to .gitignore ([99df579](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/99df579e4d3262f6fb839c0f8941be28d19c46d6))
* add example .env file ([71bb990](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/71bb99036e7f0544b0842b06d6fc6ea5301e44f3))
* add package to package.json ([df72067](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/df7206787d03ecdc1cc04d80267b6c2cd28ae707))
* **api:** gitignore coding agents ([7c58e25](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7c58e25eb03bc7f03b1a9ad2dcf74e3d67881098))
* **api:** linting for launch ([51ef300](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/51ef300ed2073324b160925b4716fe3140357a5b))
* **api:** migrate pkg manager to uv ([12a8f74](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/12a8f74e586a131a1cbd7a0dddfbb5da2a50e0a0))
* **api:** point local dev to 4010 port for prism ([cfe1692](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/cfe16928baeb37d7fcd422879ae0a4232624a195))
* **api:** rename MCPToolExecution -&gt; MCPToolResult ([0b17150](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/0b171509e431489ed802e8449e4ff42915961e03))
* **api:** small type fixes ([4b3528e](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4b3528e356f2f8051164d5da381517b0d7b3f6b5))
* **auth:** add minor auth params ([608e4d7](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/608e4d70e8ea3fc924233d163b3184ac711a42c0))
* break long lines in snippets into multiline ([776c1a9](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/776c1a9876152a598d599bd575a7bdbcf7c2a3ce))
* ci build action ([ead219a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ead219abca40bd888a01d2937a3d681709184355))
* **ci:** upgrade `actions/github-script` ([7ada191](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7ada191b13c452a563f4d43bf20ad35eea0abd95))
* **client:** do not parse responses with empty content-length ([9d8eadd](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/9d8eadd3374c002a54cc2574e885bdb0d9c98166))
* **client:** fix logger property type ([a57767f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a57767f1f7b579882068f6f59a3694bb24981fc9))
* **client:** qualify global Blob ([e1a4ef9](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e1a4ef931fd8a47a581af83cb795e18fbe9ef78e))
* **client:** restructure abort controller binding ([9e177d6](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/9e177d6b4f922cf81b7af1df5b6a68ef61cbf58f))
* **codegen:** internal codegen update ([ea4018a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ea4018afb0d7bfcfa8c55b7f5f59fd82723dfbcd))
* configure new SDK language ([5a3580c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5a3580cc83b561b0315b7d062955c69dfd63997b))
* configure new SDK language ([f85d93a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f85d93a25ab41d9dbe6681f51b45697a2addbc5b))
* **deps:** update dependency @types/node to v20.17.58 ([4f267c5](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4f267c51a9019e729691f590272429d0aeb4fe7a))
* do not install brew dependencies in ./scripts/bootstrap by default ([faf80c4](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/faf80c4b83e320d3b0c3bdb0ea3e8cc73fc2d018))
* extract some types in mcp docs ([afd8a03](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/afd8a03407f6402973382390fdc2302ffc41993c))
* **internal:** add health check to MCP server when running in HTTP mode ([c0ee23f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c0ee23f1e8692fb94163f4ddb4742c7670e72f08))
* **internal:** allow basic filtering of methods allowed for MCP code mode ([1e92341](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1e923417582f2687d51f49e82126cc5af788ae26))
* **internal:** always generate MCP server dockerfiles and upgrade associated dependencies ([355c043](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/355c043195585c471a39a68211a202bed03d33a9))
* **internal:** codegen related update ([2c0bef3](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/2c0bef30fcb34c18eb5621f8ab7df9491d0ba140))
* **internal:** codegen related update ([40b2e37](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/40b2e3736a2a54e724b984750e04dea7cac2c2e9))
* **internal:** codegen related update ([1722351](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/17223510393dab938c83ccd84b8b8c30bb5217a7))
* **internal:** codegen related update ([979ace9](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/979ace93ccaf5f435804b2fe4c14b900d1b19951))
* **internal:** codegen related update ([1f98c6a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1f98c6a2b009bcabf82a537716a24540e49ece39))
* **internal:** codegen related update ([ca19395](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ca19395b3e1040e375478932d4d1c9a3e35f3d62))
* **internal:** codegen related update ([fb305c6](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/fb305c6c164386b5eb50126f6b015fe10df43645))
* **internal:** codegen related update ([beb6aa1](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/beb6aa162da4c5d5a96063f4f6211b22df5a8895))
* **internal:** codegen related update ([63bb96f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/63bb96fee8a14afb5c48ba4e95862e9f2871ccef))
* **internal:** codegen related update ([982e9e4](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/982e9e41b28d038bbc7427d5ac0aadb4a7270710))
* **internal:** codegen related update ([1acc8d1](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1acc8d1b39c3f006b11c31db7e82421a2c6edc29))
* **internal:** codegen related update ([663de79](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/663de790cb73b9fc0d4d56baf1d20017bff3f4aa))
* **internal:** codegen related update ([425c937](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/425c937a0b1f84b17047ace8492e0283e36b333c))
* **internal:** codegen related update ([47b5877](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/47b58778296443789b45f1bec87f87d652548d29))
* **internal:** codegen related update ([6244dd7](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6244dd7c27a1207dc746431b59d4a5b998f2c621))
* **internal:** codegen related update ([9d7074a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/9d7074aed3203385a3dd871df6dec7245ceb1d9d))
* **internal:** codegen related update ([9e8f31c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/9e8f31c0364fd292bfb2a0a7e7006bbef6afe0d5))
* **internal:** codegen related update ([14f03bf](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/14f03bffe709d678669087082da170cde8ffd6a3))
* **internal:** configure MCP Server hosting ([f93d33c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f93d33cfafd2c21892906235d0e5f90a941df9cf))
* **internal:** fix dockerfile ([00b0f7f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/00b0f7f9e0480e998b9725a65a5044092b130fd8))
* **internal:** fix incremental formatting in some cases ([7a91709](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7a917093e5c22cf3d357d8c52fdda1a7e3bbbb6b))
* **internal:** formatting change ([96094f4](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/96094f48b5ea80257499e8553cc2395e9eaeadd6))
* **internal:** gitignore .mcpb files ([56749a1](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/56749a1b4530e45625b3bf59f4cd6bc1b8c3567a))
* **internal:** grammar fix (it's -&gt; its) ([d2ee048](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/d2ee04877ba338604528c5f453f3c3a7d7275901))
* **internal:** ignore .eslintcache ([b762b7f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/b762b7fcf8dad60c348aca0e3fd550feff0b2077))
* **internal:** make mcp-server publishing public by defaut ([c7401ae](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c7401ae3d6b920dd36099652ce9a8bfa2d28f26d))
* **internal:** refactor array check ([168b3ab](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/168b3ab37ba60c748b46477939453e1925db1701))
* **internal:** refactor flag parsing for MCP servers and add debug flag ([775dfb4](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/775dfb41a92ec728c3e1419a9772d9c93323ff0e))
* **internal:** remove .eslintcache ([b7be612](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/b7be612072d3d171ee5f31f373d707ad07cc4e3c))
* **internal:** remove deprecated `compilerOptions.baseUrl` from tsconfig.json ([6e1f08a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6e1f08acc1d2173b414ba7100a33bcdaafab21f6))
* **internal:** support oauth authorization code flow for MCP servers ([3e213d5](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/3e213d5ead22000829607e09b6f5bb87b289c95a))
* **internal:** update `actions/checkout` version ([76cea61](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/76cea612aef402940f186af6d4e1acf7b150ee4a))
* **internal:** update comment in script ([182b82a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/182b82a5b65934bc7a46f4375c048b5b2c44ad1f))
* **internal:** update global Error reference ([33ba316](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/33ba316073761720832452b4b5e4c95df56fe623))
* **internal:** update lock file ([4c12119](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4c1211972ef49ed3e3c842e8143182176d8535cc))
* **internal:** upgrade babel, qs, js-yaml ([6883ebc](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6883ebc0aee597dcd57d577a13548e9dfadf3f2d))
* **internal:** upgrade eslint ([394adcd](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/394adcd67ceefa5c42d245e0ece3afaa1c844d96))
* **internal:** use npm pack for build uploads ([6e1f05a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6e1f05a076ada16fa6dda26f0b835a9d3051b412))
* **jsdoc:** fix [@link](https://github.com/link) annotations to refer only to parts of the package‘s public interface ([77e618c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/77e618c90bfc216fedcf3c53574d88c1a920ae05))
* linting ([057bf51](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/057bf5179e13a9f10187526720e9d9d81e03caa0))
* mcp code tool explicit error message when missing a run function ([455da8a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/455da8a144aba6c4e8adc00fe402ea4508620da7))
* **mcp:** add cors to oauth metadata route ([220072a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/220072af73f4b4f3881303e8eada3840bf1b33e3))
* **mcp:** add friendlier MCP code tool errors on incorrect method invocations ([35d66ed](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/35d66edae245d7e079aeaf526ac2bc5e2c0472c0))
* **mcp:** add intent param to execute tool ([4064270](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/40642702aebbe42e38b9859066436a90025f339e))
* **mcp:** add line numbers to code tool errors ([0264767](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/0264767edaa51a92f9a1895cb2bc75ab0bd08592))
* **mcp:** allow pointing `docs_search` tool at other URLs ([efd6160](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/efd61600aa9826cc6d26ac833fa522a8463bc811))
* **mcp:** clarify http auth error ([10bc93d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/10bc93d8396bf29303226f2ad2b3b98b0d234b5a))
* **mcp:** document remote server in README.md ([fa265eb](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/fa265eb2c7baa1c2c23a9b7054a103b01f47a47e))
* **mcp:** minor cleanup of types and package.json ([1222f8e](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1222f8e115ceb3ac6ebd0aa1dc2cd2b4b8049dff))
* **mcp:** pass intent param to execute handler ([fb67ec1](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/fb67ec1995e562f4fd0b8e1963826fd5969b4966))
* **mcp:** remove deprecated tool schemes ([cd9f160](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/cd9f1608d06c4c37d7fb6301f424de294c139bca))
* **mcp:** rename dxt to mcpb ([1af1490](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1af14905e5fddc0cc0d372fde72d8bd06d39d62e))
* **mcp:** up tsconfig lib version to es2022 ([1cbb087](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1cbb087e036f6a962ddad2d9554b5410f6cdeb29))
* **mcp:** update lockfile ([23018bd](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/23018bdf22d044a0a19ffe7ffb80d66e03442ebb))
* **mcp:** update package.json ([1c55ce0](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1c55ce0b0ab96c7317da1390de1671580341af56))
* **mcp:** update README ([0ce5614](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/0ce5614bdfe9b990e1813e70e7c75dcd48208cf7))
* **mcp:** update types ([536e22b](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/536e22b79c550301157f61ecabb3ce2933c024b6))
* **mcp:** upgrade dependencies ([3605367](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/3605367c02a1149ad4fe73c66fd5e17aec405799))
* **mcp:** upgrade jq-web ([83b2b3a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/83b2b3a58ae2e8d819bfbbe8b718e80cbf27ad19))
* **mcp:** upload dxt as release asset ([2520183](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/252018372e9d1886193e15e58e1a4b8e98fe6f4e))
* update @stainless-api/prism-cli to v5.15.0 ([7a9d8ce](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7a9d8ce11bc8c56894c8bcef1f5d313619d5325e))
* update CI script ([532493a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/532493a9bc252db84e0fc5c094ce22ec53a2e54d))
* update lockfile ([7fc67b2](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7fc67b26263d8cea1c61c8c5dc1602eb47f083c7))
* use latest @modelcontextprotocol/sdk ([ab3663d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ab3663ddb7d7f38e12c57f790319ef3561ba1974))
* use structured error when code execution tool errors ([e6cd3bc](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e6cd3bc99883bdbd818bedc50425cd373f2bbdb0))


### Documentation

* **api:** add examples for zod & effect ([097804e](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/097804ede721bb2eb2ce9ac33afa1d818acab6de))
* **mcp:** add a README button for one-click add to Cursor ([6d89547](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6d89547d55126b704aab8b76d39cd3d44d061255))
* **mcp:** add a README link to add server to VS Code or Claude Code ([d71586b](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/d71586b5ca5957dadffcd169b6d0f2c8f9268ad1))
* prominently feature MCP server setup in root SDK readmes ([8c520b1](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/8c520b11e43976046433084b1181c957a51163be))


### Refactors

* **api:** types for mcp server serialization ([bee486b](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/bee486b02939c3c7a0016c2e32dd9fc1df3f1b84))
* **api:** update auth types ([161c23e](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/161c23e4c2f8d6055aed4ef0899227c1cafb10c8))
* **helpers:** fix example import path ([a78e1db](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a78e1db647cf5fe4e2e91884213262043f73ae14))
* **runner:** standardize dir layout ([c7cf1d5](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c7cf1d50d2aa3ddcf717748b4c6f1990af098aa9))

## 0.1.0-alpha.9 (2025-12-10)

Full Changelog: [v0.1.0-alpha.8...v0.1.0-alpha.9](https://github.com/dedalus-labs/dedalus-sdk-typescript/compare/v0.1.0-alpha.8...v0.1.0-alpha.9)

### Features

* **api:** config update for dedalus-ai/dev ([8c11861](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/8c118618ec69f55a087a043abee618119a0606d2))
* **api:** mcp server params ([8c60036](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/8c60036fbf24faa8cb214d374b1ff3e870729305))
* **mcp:** add typescript check to code execution tool ([024c566](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/024c5668e2f25b52976ba1f8fc3630db0a6d0597))
* **mcp:** handle code mode calls in the Stainless API ([5207502](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/52075024138a9341c20391f339c2f628a7dfb535))
* **mcp:** return logs on code tool errors ([0c59c13](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/0c59c13635e51387660f81e8290a42b26ac2ec15))


### Bug Fixes

* **api:** add thought signature ([4564ccb](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4564ccb11385c0570266eee44798058d9f73fe48))
* **mcp:** add client instantiation options to code tool ([42dcae2](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/42dcae291dd96814dc9f011f04101ede35a7622c))
* **mcp:** correct code tool API endpoint ([610456d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/610456d624c5e6409392bd50df2221a7ed97552f))
* **mcp:** return correct lines on typescript errors ([4e10642](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4e106423fa976e775f8d747b66514f1dd72eb294))


### Chores

* **api:** migrate pkg manager to uv ([12a8f74](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/12a8f74e586a131a1cbd7a0dddfbb5da2a50e0a0))
* **api:** point local dev to 4010 port for prism ([cfe1692](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/cfe16928baeb37d7fcd422879ae0a4232624a195))
* **auth:** add minor auth params ([608e4d7](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/608e4d70e8ea3fc924233d163b3184ac711a42c0))
* **client:** fix logger property type ([a57767f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a57767f1f7b579882068f6f59a3694bb24981fc9))
* **internal:** codegen related update ([982e9e4](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/982e9e41b28d038bbc7427d5ac0aadb4a7270710))
* **internal:** codegen related update ([1acc8d1](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1acc8d1b39c3f006b11c31db7e82421a2c6edc29))
* **internal:** upgrade eslint ([394adcd](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/394adcd67ceefa5c42d245e0ece3afaa1c844d96))
* **mcp:** update lockfile ([23018bd](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/23018bdf22d044a0a19ffe7ffb80d66e03442ebb))
* use latest @modelcontextprotocol/sdk ([ab3663d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ab3663ddb7d7f38e12c57f790319ef3561ba1974))


### Refactors

* **api:** types for mcp server serialization ([bee486b](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/bee486b02939c3c7a0016c2e32dd9fc1df3f1b84))

## 0.1.0-alpha.8 (2025-11-26)

Full Changelog: [v0.1.0-alpha.7...v0.1.0-alpha.8](https://github.com/dedalus-labs/dedalus-sdk-typescript/compare/v0.1.0-alpha.7...v0.1.0-alpha.8)

### Features

* **api:** add endpoints ([f76b925](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f76b9258e7e232eee002ab387f54b69ae71040fd))
* **api:** add endpoints ([48fe852](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/48fe85202cdbc3697daa0e7c14b8b4c523202736))
* **api:** add streaming ([e188e04](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e188e04047defdb5b85e4b1a49b28dce8793772c))
* **api:** add streaming configuration ([ff8bac6](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ff8bac6f034626ddd6fbed21d3117472a6cff1a4))
* **api:** adjust parameters ([8a91533](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/8a91533602d6aa391a1ef506992ae00215a82f6d))
* **api:** api update ([a6576c3](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a6576c3169abb6a5b42ee130f69818a1004e2675))
* **api:** api update ([4722f77](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4722f77eab82382374594b0482ce891aa7dcf5c0))
* **api:** api update ([94ba5c1](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/94ba5c13bf4af0758211469be9e4c88e7fe03126))
* **api:** api update ([4f2d043](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4f2d0435105eb48c6281335b2e9203b1236445b6))
* **api:** api update ([86bd375](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/86bd3757f5c0a09107d168be798e082aac04ce45))
* **api:** api update ([568bc3a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/568bc3a55e5d2591a20071ba51c94c26c04e9b88))
* **api:** api update ([347ada6](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/347ada6a111d7a47be830a1585fa0805d44cd797))
* **api:** api update ([dc61e7a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/dc61e7aff089db86a5784b981d3bec8ec00fecf8))
* **api:** api update ([5967ce0](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5967ce0a93336b42b672e6e73475828d04fd5a22))
* **api:** api update ([3e37ce7](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/3e37ce75aa26ceb1bcfe3a999b106631ca91ae0e))
* **api:** api update ([86aeabb](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/86aeabb58030c9f81743055e1649c5c66a3ba628))
* **api:** api update ([6aed08c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6aed08ce0d145dcf6224c5e272d50ab2710b5c4f))
* **api:** api update ([c9ccd5a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c9ccd5a7e92dffe4d92a7e07ebb631fb5b7882c2))
* **api:** auto exec tools ([2dc1d78](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/2dc1d78730353c05b8920929ba7371dad9c508c2))
* **api:** chat completions ([8e28a07](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/8e28a0722055a0bb476f73a5ca75291182e02b51))
* **api:** config update for dedalus-ai/dev ([0df93e2](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/0df93e22387cdec588897e8efb646c34abf5065b))
* **api:** Config update for dedalus-ai/dev ([9ca4792](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/9ca47923acbe8cc6ca766a9957d1cab41f8b09f3))
* **api:** decouple Model and DedalusModel ([5a1ddd1](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5a1ddd1f87670b0beec85f9010f27376f5d0c01a))
* **api:** dedalus model update ([99bd4df](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/99bd4dfb02aa2004d59e387b7e391706ded9cbb9))
* **api:** id-&gt;name in DedalusModel ([c05611a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c05611a838aa7c4f0d363da20ca725e25d56cca5))
* **api:** image support ([9e0db2d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/9e0db2d03fcbe0b03bb5975dd1f34fdb17e6d405))
* **api:** improve types ([c89f938](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c89f93841f70c84323ba6423be6b0f57e2ddf561))
* **api:** logic adj ([868d32b](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/868d32b51aee4ed66be548366aab65d2c97901c6))
* **api:** manual updates ([758631f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/758631f62a13459d24e76401f70f6fba385a78e1))
* **api:** manual updates ([fc8a369](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/fc8a3695ff4a5fdb8c0e9c569c2c10e8dffed041))
* **api:** messages param nullable ([254f9ef](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/254f9ef5397df901ddc8ac2b21e9ee3431f0c132))
* **api:** ModelConfig ([1201c05](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1201c056caae634a44bef2669f0af6e46ec6b19c))
* **api:** polished types ([f452201](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f452201bf28fa0590e2e46b57fbb00036dd9e9f9))
* **api:** response format ([765345e](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/765345eb89f6ca4528cf9a9554f1356afba7bec4))
* **api:** revert streaming for now ([c649f85](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c649f853cde2745cde926f9d5b0607bfd6afec60))
* **api:** schema compiler landed ([58cea7d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/58cea7d1d5b6c26ca8ef9601461a3cf2d86cc79a))
* **api:** spec concise ([19c1c44](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/19c1c44fe7e2e2b5781244b62e53a44c2ce0220b))
* **api:** standardize name casing with stainless initialism ([a295370](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a2953702f8c371cb7d8eaf60b92167c8a8926d97))
* **api:** streaming change ([088bd96](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/088bd9694cd8f5936b85e94d77ed7543135cd5c7))
* **api:** structured outputs ([76b74e5](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/76b74e502c94f3434c9dd6d3459594c1a50da539))
* **api:** to_schema and Model class ([acdf4b2](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/acdf4b2816be6372b6a489d6c15e277abb3bdb65))
* **api:** update types ([99536e8](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/99536e8120f332ca9b68eb9988bf4527b70a290c))
* **api:** update via SDK Studio ([a9c162d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a9c162d174c289c8394fe8d115c6464bad90b09c))
* **mcp:** add code execution tool ([d642b3b](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/d642b3b6f377b736f495f143468b1e4634f6b23f))
* **mcp:** add detail field to docs search tool ([f626d60](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f626d608160a127706832de7cffa19d96e686101))
* **mcp:** add docs search tool ([c84a5e0](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c84a5e0f59301851fb429f9580d1a57814fc3a06))
* **mcp:** add logging when environment variable is set ([5f554db](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5f554db9bb23ae303bf3e2d267661b3b6cd1de8d))
* **mcp:** add option for including docs tools ([4886db9](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4886db9126e19f846a3562b6aa9667f859bdc2ac))
* **mcp:** add option to infer mcp client ([2ee9508](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/2ee95089fdcc9605d0b9aae00ec66aa94bcb9c63))
* **mcp:** allow setting logging level ([ed246b9](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ed246b9b3d3008a3e0952ed922fa4ec97f9591c9))
* **mcp:** enable experimental docs search tool ([27a07ae](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/27a07aea9ebcb46ab5b504b8e660ef4dc1028199))
* **mcp:** enable optional code execution tool on http mcp servers ([6f186fa](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6f186fa13482c0482c0654161f35d348571981e7))
* **mcp:** expose client options in `streamableHTTPApp` ([a033b07](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a033b07452ca178eca485e4f47639603f6fbc07e))
* **mcp:** parse query string as mcp client options in mcp server ([ed28a00](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ed28a000ee0f10b6a104decbdb45b68c16a1594b))
* **model:** add DedalusModel ([e0391a0](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e0391a04b6ae0fb590d64cb4cf871ac84163253c))
* **runner:** add type defns ([d87bda2](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/d87bda271da4ace957a1b2cd34d58ffa62bcd8ec))
* **utils:** new util funcs ([51b9d14](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/51b9d14de98848a6ebe9470520bcf3d6f7f3061d))


### Bug Fixes

* **api:** add shared DedalusModel type ([8f5e610](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/8f5e610e62af700cdfc2f3055fe5cadb2f6f9eed))
* **api:** merge origin/next and update types for new schema structure ([5e8a661](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5e8a66160f3caa143dff82175beae65b66da7f46))
* **ci:** set permissions for DXT publish action ([ea94670](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ea94670575f5ea2298f307f63b3dd76d0237e33f))
* coerce nullable values to undefined ([3d400a7](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/3d400a7dd40b057624cd1ffc7d2de5aab4a0476c))
* **mcp:** avoid importing unsupported libraries on non-node environments ([e21c04e](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e21c04e1441788cb346eaa61cd0b8c030eaea534))
* **mcp:** avoid sending `jq_filter` to base API ([b41959f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/b41959fbc2099bad8e81a90a52aaf7e8eef0cb1b))
* **mcpb:** pin @anthropic-ai/mcpb version ([779f76d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/779f76d17c1566ad68fb6fcb4227e72da35fafe6))
* **mcp:** fix cli argument parsing logic ([d116c44](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/d116c44132e8ea3f25ea9bcd593c509d9d66bf0f))
* **mcp:** fix query options parsing ([6ec3b6f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6ec3b6fab4548ebbcc0f027b202fe0a8e14b5438))
* **mcp:** fix tool description of jq_filter ([5036dba](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5036dba016f7950947f83a88bdb4663a15ede10f))
* **mcp:** fix uploading dxt release assets ([c51827d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c51827dda5a8a0791da987b41033a76e7a16dc2c))
* **mcp:** generate additionalProperties=true for map schemas to avoid validation issues ([7ab6742](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7ab6742b3beb9d731cf72f97e1710cb7e17dba07))
* **mcp:** resolve a linting issue in server code ([ad8cd0a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ad8cd0aa38b784d7d9b61da3b3e15c912f9f6e02))
* **mcp:** return tool execution error on jq failure ([734dc43](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/734dc432f4ca1bd445c9fb7c9283f5c7b09cc01b))
* **mcp:** reverse validJson capability option and limit scope ([eca5383](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/eca53838dff4fd099e71f72b309532f47ea74331))
* **mcp:** use raw responses for binary content ([caebbe8](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/caebbe8310be50666c96f45521e3b86f3fc145c8))


### Performance Improvements

* faster formatting ([5122ffe](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5122ffe8a154907d3d7727f0f07885e92dbc8134))


### Chores

* add package to package.json ([df72067](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/df7206787d03ecdc1cc04d80267b6c2cd28ae707))
* **api:** gitignore coding agents ([7c58e25](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7c58e25eb03bc7f03b1a9ad2dcf74e3d67881098))
* **api:** linting for launch ([51ef300](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/51ef300ed2073324b160925b4716fe3140357a5b))
* ci build action ([ead219a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ead219abca40bd888a01d2937a3d681709184355))
* **client:** qualify global Blob ([e1a4ef9](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e1a4ef931fd8a47a581af83cb795e18fbe9ef78e))
* **codegen:** internal codegen update ([ea4018a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ea4018afb0d7bfcfa8c55b7f5f59fd82723dfbcd))
* configure new SDK language ([5a3580c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5a3580cc83b561b0315b7d062955c69dfd63997b))
* configure new SDK language ([f85d93a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f85d93a25ab41d9dbe6681f51b45697a2addbc5b))
* **deps:** update dependency @types/node to v20.17.58 ([4f267c5](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4f267c51a9019e729691f590272429d0aeb4fe7a))
* do not install brew dependencies in ./scripts/bootstrap by default ([faf80c4](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/faf80c4b83e320d3b0c3bdb0ea3e8cc73fc2d018))
* extract some types in mcp docs ([afd8a03](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/afd8a03407f6402973382390fdc2302ffc41993c))
* **internal:** codegen related update ([663de79](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/663de790cb73b9fc0d4d56baf1d20017bff3f4aa))
* **internal:** codegen related update ([425c937](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/425c937a0b1f84b17047ace8492e0283e36b333c))
* **internal:** codegen related update ([47b5877](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/47b58778296443789b45f1bec87f87d652548d29))
* **internal:** codegen related update ([6244dd7](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6244dd7c27a1207dc746431b59d4a5b998f2c621))
* **internal:** codegen related update ([9d7074a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/9d7074aed3203385a3dd871df6dec7245ceb1d9d))
* **internal:** codegen related update ([9e8f31c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/9e8f31c0364fd292bfb2a0a7e7006bbef6afe0d5))
* **internal:** codegen related update ([14f03bf](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/14f03bffe709d678669087082da170cde8ffd6a3))
* **internal:** configure MCP Server hosting ([f93d33c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f93d33cfafd2c21892906235d0e5f90a941df9cf))
* **internal:** fix incremental formatting in some cases ([7a91709](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7a917093e5c22cf3d357d8c52fdda1a7e3bbbb6b))
* **internal:** formatting change ([96094f4](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/96094f48b5ea80257499e8553cc2395e9eaeadd6))
* **internal:** gitignore .mcpb files ([56749a1](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/56749a1b4530e45625b3bf59f4cd6bc1b8c3567a))
* **internal:** grammar fix (it's -&gt; its) ([d2ee048](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/d2ee04877ba338604528c5f453f3c3a7d7275901))
* **internal:** ignore .eslintcache ([b762b7f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/b762b7fcf8dad60c348aca0e3fd550feff0b2077))
* **internal:** make mcp-server publishing public by defaut ([c7401ae](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c7401ae3d6b920dd36099652ce9a8bfa2d28f26d))
* **internal:** refactor array check ([168b3ab](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/168b3ab37ba60c748b46477939453e1925db1701))
* **internal:** remove .eslintcache ([b7be612](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/b7be612072d3d171ee5f31f373d707ad07cc4e3c))
* **internal:** remove deprecated `compilerOptions.baseUrl` from tsconfig.json ([6e1f08a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6e1f08acc1d2173b414ba7100a33bcdaafab21f6))
* **internal:** update comment in script ([182b82a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/182b82a5b65934bc7a46f4375c048b5b2c44ad1f))
* **internal:** update global Error reference ([33ba316](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/33ba316073761720832452b4b5e4c95df56fe623))
* **internal:** use npm pack for build uploads ([6e1f05a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6e1f05a076ada16fa6dda26f0b835a9d3051b412))
* **jsdoc:** fix [@link](https://github.com/link) annotations to refer only to parts of the package‘s public interface ([77e618c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/77e618c90bfc216fedcf3c53574d88c1a920ae05))
* mcp code tool explicit error message when missing a run function ([455da8a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/455da8a144aba6c4e8adc00fe402ea4508620da7))
* **mcp:** add cors to oauth metadata route ([220072a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/220072af73f4b4f3881303e8eada3840bf1b33e3))
* **mcp:** add friendlier MCP code tool errors on incorrect method invocations ([35d66ed](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/35d66edae245d7e079aeaf526ac2bc5e2c0472c0))
* **mcp:** add line numbers to code tool errors ([0264767](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/0264767edaa51a92f9a1895cb2bc75ab0bd08592))
* **mcp:** allow pointing `docs_search` tool at other URLs ([efd6160](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/efd61600aa9826cc6d26ac833fa522a8463bc811))
* **mcp:** clarify http auth error ([10bc93d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/10bc93d8396bf29303226f2ad2b3b98b0d234b5a))
* **mcp:** document remote server in README.md ([fa265eb](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/fa265eb2c7baa1c2c23a9b7054a103b01f47a47e))
* **mcp:** minor cleanup of types and package.json ([1222f8e](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1222f8e115ceb3ac6ebd0aa1dc2cd2b4b8049dff))
* **mcp:** rename dxt to mcpb ([1af1490](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1af14905e5fddc0cc0d372fde72d8bd06d39d62e))
* **mcp:** update package.json ([1c55ce0](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1c55ce0b0ab96c7317da1390de1671580341af56))
* **mcp:** update README ([0ce5614](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/0ce5614bdfe9b990e1813e70e7c75dcd48208cf7))
* **mcp:** update types ([536e22b](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/536e22b79c550301157f61ecabb3ce2933c024b6))
* **mcp:** upgrade jq-web ([83b2b3a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/83b2b3a58ae2e8d819bfbbe8b718e80cbf27ad19))
* **mcp:** upload dxt as release asset ([2520183](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/252018372e9d1886193e15e58e1a4b8e98fe6f4e))
* update @stainless-api/prism-cli to v5.15.0 ([7a9d8ce](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7a9d8ce11bc8c56894c8bcef1f5d313619d5325e))
* update CI script ([532493a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/532493a9bc252db84e0fc5c094ce22ec53a2e54d))
* update lockfile ([7fc67b2](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7fc67b26263d8cea1c61c8c5dc1602eb47f083c7))
* use structured error when code execution tool errors ([e6cd3bc](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e6cd3bc99883bdbd818bedc50425cd373f2bbdb0))


### Documentation

* **mcp:** add a README button for one-click add to Cursor ([6d89547](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6d89547d55126b704aab8b76d39cd3d44d061255))
* **mcp:** add a README link to add server to VS Code or Claude Code ([d71586b](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/d71586b5ca5957dadffcd169b6d0f2c8f9268ad1))


### Refactors

* **helpers:** fix example import path ([a78e1db](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a78e1db647cf5fe4e2e91884213262043f73ae14))
* **runner:** standardize dir layout ([c7cf1d5](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c7cf1d50d2aa3ddcf717748b4c6f1990af098aa9))

## 0.1.0-alpha.7 (2025-11-25)

Full Changelog: [v0.1.0-alpha.6...v0.1.0-alpha.7](https://github.com/dedalus-labs/dedalus-sdk-typescript/compare/v0.1.0-alpha.6...v0.1.0-alpha.7)

### Features

* **mcp:** add detail field to docs search tool ([f626d60](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f626d608160a127706832de7cffa19d96e686101))

## 0.1.0-alpha.6 (2025-11-25)

Full Changelog: [v0.1.0-alpha.5...v0.1.0-alpha.6](https://github.com/dedalus-labs/dedalus-sdk-typescript/compare/v0.1.0-alpha.5...v0.1.0-alpha.6)

### Features

* **api:** config update for dedalus-ai/dev ([0df93e2](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/0df93e22387cdec588897e8efb646c34abf5065b))
* **api:** messages param nullable ([254f9ef](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/254f9ef5397df901ddc8ac2b21e9ee3431f0c132))
* **api:** response format ([765345e](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/765345eb89f6ca4528cf9a9554f1356afba7bec4))
* **api:** schema compiler landed ([58cea7d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/58cea7d1d5b6c26ca8ef9601461a3cf2d86cc79a))
* **api:** standardize name casing with stainless initialism ([a295370](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a2953702f8c371cb7d8eaf60b92167c8a8926d97))
* **runner:** add type defns ([d87bda2](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/d87bda271da4ace957a1b2cd34d58ffa62bcd8ec))
* **utils:** new util funcs ([51b9d14](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/51b9d14de98848a6ebe9470520bcf3d6f7f3061d))


### Bug Fixes

* **mcp:** return tool execution error on jq failure ([734dc43](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/734dc432f4ca1bd445c9fb7c9283f5c7b09cc01b))
* **mcp:** use raw responses for binary content ([caebbe8](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/caebbe8310be50666c96f45521e3b86f3fc145c8))


### Chores

* **api:** gitignore coding agents ([7c58e25](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7c58e25eb03bc7f03b1a9ad2dcf74e3d67881098))
* **internal:** configure MCP Server hosting ([f93d33c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f93d33cfafd2c21892906235d0e5f90a941df9cf))
* **mcp:** clarify http auth error ([10bc93d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/10bc93d8396bf29303226f2ad2b3b98b0d234b5a))
* **mcp:** upgrade jq-web ([83b2b3a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/83b2b3a58ae2e8d819bfbbe8b718e80cbf27ad19))


### Refactors

* **runner:** standardize dir layout ([c7cf1d5](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c7cf1d50d2aa3ddcf717748b4c6f1990af098aa9))

## 0.1.0-alpha.5 (2025-10-10)

Full Changelog: [v0.1.0-alpha.4...v0.1.0-alpha.5](https://github.com/dedalus-labs/dedalus-sdk-typescript/compare/v0.1.0-alpha.4...v0.1.0-alpha.5)

### Features

* **api:** add endpoints ([48fe852](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/48fe85202cdbc3697daa0e7c14b8b4c523202736))
* **api:** adjust parameters ([8a91533](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/8a91533602d6aa391a1ef506992ae00215a82f6d))
* **api:** api update ([a6576c3](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a6576c3169abb6a5b42ee130f69818a1004e2675))
* **api:** api update ([4722f77](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4722f77eab82382374594b0482ce891aa7dcf5c0))
* **api:** api update ([94ba5c1](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/94ba5c13bf4af0758211469be9e4c88e7fe03126))
* **api:** api update ([4f2d043](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4f2d0435105eb48c6281335b2e9203b1236445b6))
* **api:** api update ([86bd375](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/86bd3757f5c0a09107d168be798e082aac04ce45))
* **api:** api update ([568bc3a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/568bc3a55e5d2591a20071ba51c94c26c04e9b88))
* **api:** api update ([347ada6](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/347ada6a111d7a47be830a1585fa0805d44cd797))
* **api:** api update ([dc61e7a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/dc61e7aff089db86a5784b981d3bec8ec00fecf8))
* **api:** api update ([5967ce0](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5967ce0a93336b42b672e6e73475828d04fd5a22))
* **api:** api update ([3e37ce7](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/3e37ce75aa26ceb1bcfe3a999b106631ca91ae0e))
* **api:** api update ([86aeabb](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/86aeabb58030c9f81743055e1649c5c66a3ba628))
* **api:** api update ([6aed08c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6aed08ce0d145dcf6224c5e272d50ab2710b5c4f))
* **api:** auto exec tools ([2dc1d78](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/2dc1d78730353c05b8920929ba7371dad9c508c2))
* **api:** chat completions ([8e28a07](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/8e28a0722055a0bb476f73a5ca75291182e02b51))
* **api:** Config update for dedalus-ai/dev ([9ca4792](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/9ca47923acbe8cc6ca766a9957d1cab41f8b09f3))
* **api:** decouple Model and DedalusModel ([5a1ddd1](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5a1ddd1f87670b0beec85f9010f27376f5d0c01a))
* **api:** dedalus model update ([99bd4df](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/99bd4dfb02aa2004d59e387b7e391706ded9cbb9))
* **api:** id-&gt;name in DedalusModel ([c05611a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c05611a838aa7c4f0d363da20ca725e25d56cca5))
* **api:** logic adj ([868d32b](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/868d32b51aee4ed66be548366aab65d2c97901c6))
* **api:** manual updates ([758631f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/758631f62a13459d24e76401f70f6fba385a78e1))
* **api:** manual updates ([fc8a369](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/fc8a3695ff4a5fdb8c0e9c569c2c10e8dffed041))
* **api:** ModelConfig ([1201c05](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1201c056caae634a44bef2669f0af6e46ec6b19c))
* **api:** polished types ([f452201](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f452201bf28fa0590e2e46b57fbb00036dd9e9f9))
* **api:** spec concise ([19c1c44](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/19c1c44fe7e2e2b5781244b62e53a44c2ce0220b))
* **api:** streaming change ([088bd96](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/088bd9694cd8f5936b85e94d77ed7543135cd5c7))
* **api:** to_schema and Model class ([acdf4b2](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/acdf4b2816be6372b6a489d6c15e277abb3bdb65))
* **api:** update types ([99536e8](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/99536e8120f332ca9b68eb9988bf4527b70a290c))
* **mcp:** add code execution tool ([d642b3b](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/d642b3b6f377b736f495f143468b1e4634f6b23f))
* **mcp:** add docs search tool ([c84a5e0](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c84a5e0f59301851fb429f9580d1a57814fc3a06))
* **mcp:** add option for including docs tools ([4886db9](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4886db9126e19f846a3562b6aa9667f859bdc2ac))
* **mcp:** add option to infer mcp client ([2ee9508](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/2ee95089fdcc9605d0b9aae00ec66aa94bcb9c63))
* **mcp:** allow setting logging level ([ed246b9](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ed246b9b3d3008a3e0952ed922fa4ec97f9591c9))
* **mcp:** enable experimental docs search tool ([27a07ae](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/27a07aea9ebcb46ab5b504b8e660ef4dc1028199))
* **mcp:** expose client options in `streamableHTTPApp` ([a033b07](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a033b07452ca178eca485e4f47639603f6fbc07e))
* **mcp:** parse query string as mcp client options in mcp server ([ed28a00](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ed28a000ee0f10b6a104decbdb45b68c16a1594b))
* **model:** add DedalusModel ([e0391a0](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e0391a04b6ae0fb590d64cb4cf871ac84163253c))


### Bug Fixes

* **ci:** set permissions for DXT publish action ([ea94670](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ea94670575f5ea2298f307f63b3dd76d0237e33f))
* coerce nullable values to undefined ([3d400a7](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/3d400a7dd40b057624cd1ffc7d2de5aab4a0476c))
* **mcp:** avoid importing unsupported libraries on non-node environments ([e21c04e](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e21c04e1441788cb346eaa61cd0b8c030eaea534))
* **mcp:** fix cli argument parsing logic ([d116c44](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/d116c44132e8ea3f25ea9bcd593c509d9d66bf0f))
* **mcp:** fix query options parsing ([6ec3b6f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6ec3b6fab4548ebbcc0f027b202fe0a8e14b5438))
* **mcp:** fix uploading dxt release assets ([c51827d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c51827dda5a8a0791da987b41033a76e7a16dc2c))
* **mcp:** generate additionalProperties=true for map schemas to avoid validation issues ([7ab6742](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7ab6742b3beb9d731cf72f97e1710cb7e17dba07))
* **mcp:** resolve a linting issue in server code ([ad8cd0a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ad8cd0aa38b784d7d9b61da3b3e15c912f9f6e02))


### Performance Improvements

* faster formatting ([5122ffe](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5122ffe8a154907d3d7727f0f07885e92dbc8134))


### Chores

* add package to package.json ([df72067](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/df7206787d03ecdc1cc04d80267b6c2cd28ae707))
* ci build action ([ead219a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ead219abca40bd888a01d2937a3d681709184355))
* **client:** qualify global Blob ([e1a4ef9](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e1a4ef931fd8a47a581af83cb795e18fbe9ef78e))
* **codegen:** internal codegen update ([ea4018a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ea4018afb0d7bfcfa8c55b7f5f59fd82723dfbcd))
* **deps:** update dependency @types/node to v20.17.58 ([4f267c5](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/4f267c51a9019e729691f590272429d0aeb4fe7a))
* do not install brew dependencies in ./scripts/bootstrap by default ([faf80c4](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/faf80c4b83e320d3b0c3bdb0ea3e8cc73fc2d018))
* extract some types in mcp docs ([afd8a03](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/afd8a03407f6402973382390fdc2302ffc41993c))
* **internal:** codegen related update ([47b5877](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/47b58778296443789b45f1bec87f87d652548d29))
* **internal:** codegen related update ([6244dd7](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6244dd7c27a1207dc746431b59d4a5b998f2c621))
* **internal:** codegen related update ([9d7074a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/9d7074aed3203385a3dd871df6dec7245ceb1d9d))
* **internal:** codegen related update ([9e8f31c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/9e8f31c0364fd292bfb2a0a7e7006bbef6afe0d5))
* **internal:** codegen related update ([14f03bf](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/14f03bffe709d678669087082da170cde8ffd6a3))
* **internal:** fix incremental formatting in some cases ([7a91709](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7a917093e5c22cf3d357d8c52fdda1a7e3bbbb6b))
* **internal:** formatting change ([96094f4](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/96094f48b5ea80257499e8553cc2395e9eaeadd6))
* **internal:** gitignore .mcpb files ([56749a1](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/56749a1b4530e45625b3bf59f4cd6bc1b8c3567a))
* **internal:** ignore .eslintcache ([b762b7f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/b762b7fcf8dad60c348aca0e3fd550feff0b2077))
* **internal:** make mcp-server publishing public by defaut ([c7401ae](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c7401ae3d6b920dd36099652ce9a8bfa2d28f26d))
* **internal:** refactor array check ([168b3ab](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/168b3ab37ba60c748b46477939453e1925db1701))
* **internal:** remove .eslintcache ([b7be612](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/b7be612072d3d171ee5f31f373d707ad07cc4e3c))
* **internal:** remove deprecated `compilerOptions.baseUrl` from tsconfig.json ([6e1f08a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6e1f08acc1d2173b414ba7100a33bcdaafab21f6))
* **internal:** update comment in script ([182b82a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/182b82a5b65934bc7a46f4375c048b5b2c44ad1f))
* **internal:** update global Error reference ([33ba316](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/33ba316073761720832452b4b5e4c95df56fe623))
* **internal:** use npm pack for build uploads ([6e1f05a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/6e1f05a076ada16fa6dda26f0b835a9d3051b412))
* **jsdoc:** fix [@link](https://github.com/link) annotations to refer only to parts of the package‘s public interface ([77e618c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/77e618c90bfc216fedcf3c53574d88c1a920ae05))
* **mcp:** add cors to oauth metadata route ([220072a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/220072af73f4b4f3881303e8eada3840bf1b33e3))
* **mcp:** allow pointing `docs_search` tool at other URLs ([efd6160](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/efd61600aa9826cc6d26ac833fa522a8463bc811))
* **mcp:** document remote server in README.md ([fa265eb](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/fa265eb2c7baa1c2c23a9b7054a103b01f47a47e))
* **mcp:** minor cleanup of types and package.json ([1222f8e](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1222f8e115ceb3ac6ebd0aa1dc2cd2b4b8049dff))
* **mcp:** rename dxt to mcpb ([1af1490](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1af14905e5fddc0cc0d372fde72d8bd06d39d62e))
* **mcp:** update package.json ([1c55ce0](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/1c55ce0b0ab96c7317da1390de1671580341af56))
* **mcp:** update README ([0ce5614](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/0ce5614bdfe9b990e1813e70e7c75dcd48208cf7))
* **mcp:** update types ([536e22b](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/536e22b79c550301157f61ecabb3ce2933c024b6))
* **mcp:** upload dxt as release asset ([2520183](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/252018372e9d1886193e15e58e1a4b8e98fe6f4e))
* update @stainless-api/prism-cli to v5.15.0 ([7a9d8ce](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7a9d8ce11bc8c56894c8bcef1f5d313619d5325e))
* update CI script ([532493a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/532493a9bc252db84e0fc5c094ce22ec53a2e54d))
* update lockfile ([7fc67b2](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7fc67b26263d8cea1c61c8c5dc1602eb47f083c7))

## 0.1.0-alpha.4 (2025-08-07)

Full Changelog: [v0.1.0-alpha.3...v0.1.0-alpha.4](https://github.com/dedalus-labs/dedalus-sdk-typescript/compare/v0.1.0-alpha.3...v0.1.0-alpha.4)

### Features

* **api:** api update ([e09da4f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e09da4ff73f922d4c4d18d7ed9f89a0083669f23))
* **api:** fixing streaming again ([7455cf3](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/7455cf34ce05f9f872e4a1befde117ac4d56c64d))
* **api:** streaming schemas ([29ff744](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/29ff744a2ad082b8aabeff68abbe2da7cc1d5c60))
* **mcp:** add unix socket option for remote MCP ([26af07a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/26af07aaf1c5d3cdc661001c912cbc1cc18aacdd))
* **mcp:** remote server with passthru auth ([8220c95](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/8220c955e1b85165ae19e8b90480297369a1265f))


### Bug Fixes

* **mcp:** fix bug in header handling ([b864d5d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/b864d5d8d7fd1d71f6bf8c8972e67e2efba3b393))


### Chores

* **internal:** move publish config ([dced8f7](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/dced8f7d75b28137ec30e45b1212565097a99e30))
* **mcp:** refactor streamable http transport ([e57300c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e57300c2d4dff66edac8b71b9a15935feb2883fb))

## 0.1.0-alpha.3 (2025-08-05)

Full Changelog: [v0.1.0-alpha.2...v0.1.0-alpha.3](https://github.com/dedalus-labs/dedalus-sdk-typescript/compare/v0.1.0-alpha.2...v0.1.0-alpha.3)

### Features

* **api:** add streaming ([e188e04](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/e188e04047defdb5b85e4b1a49b28dce8793772c))
* **api:** add streaming configuration ([ff8bac6](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/ff8bac6f034626ddd6fbed21d3117472a6cff1a4))
* **api:** revert streaming for now ([c649f85](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c649f853cde2745cde926f9d5b0607bfd6afec60))
* **mcp:** add logging when environment variable is set ([5f554db](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5f554db9bb23ae303bf3e2d267661b3b6cd1de8d))


### Bug Fixes

* **mcp:** avoid sending `jq_filter` to base API ([b41959f](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/b41959fbc2099bad8e81a90a52aaf7e8eef0cb1b))
* **mcp:** fix tool description of jq_filter ([5036dba](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5036dba016f7950947f83a88bdb4663a15ede10f))
* **mcp:** reverse validJson capability option and limit scope ([eca5383](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/eca53838dff4fd099e71f72b309532f47ea74331))

## 0.1.0-alpha.2 (2025-07-30)

Full Changelog: [v0.1.0-alpha.1...v0.1.0-alpha.2](https://github.com/dedalus-labs/dedalus-sdk-typescript/compare/v0.1.0-alpha.1...v0.1.0-alpha.2)

### Features

* **api:** api update ([c9ccd5a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/c9ccd5a7e92dffe4d92a7e07ebb631fb5b7882c2))


### Chores

* configure new SDK language ([5a3580c](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/5a3580cc83b561b0315b7d062955c69dfd63997b))

## 0.1.0-alpha.1 (2025-07-30)

Full Changelog: [v0.0.1-alpha.0...v0.1.0-alpha.1](https://github.com/dedalus-labs/dedalus-sdk-typescript/compare/v0.0.1-alpha.0...v0.1.0-alpha.1)

### Features

* **api:** update via SDK Studio ([a9c162d](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/a9c162d174c289c8394fe8d115c6464bad90b09c))


### Chores

* configure new SDK language ([f85d93a](https://github.com/dedalus-labs/dedalus-sdk-typescript/commit/f85d93a25ab41d9dbe6681f51b45697a2addbc5b))
