Requirements:
- node >= 20.11.17
- run **npm i**

---

Run with **node index.js {registration number}**

Selenium will run with --headless argument by default. To run headful browser, use: **node index.js {registration number} dev**

---

When executed successfully, the script will return a JSON with found professionals and write a results.json file. This is an example of a results json:

```
{
  [
      "status": "ATIVO",
      "name": "JOHN DOE",
      "region": "06ª Região - SP",
      "registration_number": "000000",
      "subscription_date": "01/01/2000"
  ]
}
```
