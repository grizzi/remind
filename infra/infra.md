## Dependencies

# OpenTofu

Instruction for other distributions availabe at the
[official page](https://opentofu.org/docs/intro/install/standalone/)

```bash
curl --proto '=https' --tlsv1.2 -fsSL https://get.opentofu.org/install-opentofu.sh -o install-opentofu.sh
chmod +x install-opentofu.sh
./install-opentofu.sh --install-method standalone
rm -f install-opentofu.sh
```



## Init Tofu

```bash
tofu init
```
