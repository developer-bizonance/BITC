import { Router, Request, Response } from "express";

const router = Router();

export const INDIAN_LOCATIONS: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Kakinada",
    "Rajahmundry", "Tirupati", "Kadapa", "Anantapur", "Vizianagaram", "Eluru",
    "Ongole", "Nandyal", "Machilipatnam", "Adoni", "Tenali", "Proddatur", "Chittoor", "Hindupur"
  ],
  "Arunachal Pradesh": [
    "Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Tezu", "Roing", "Along", "Namsai"
  ],
  "Assam": [
    "Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur",
    "Bongaigaon", "Karimganj", "Sivasagar", "Goalpara", "Barpeta", "Dhubri", "North Lakhimpur", "Diphu"
  ],
  "Bihar": [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif",
    "Arrah", "Begusarai", "Katihar", "Munger", "Chhapra", "Danapur", "Saharsa",
    "Sasaram", "Hajipur", "Dehri", "Bettiah", "Motihari", "Siwan"
  ],
  "Chhattisgarh": [
    "Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Jagdalpur",
    "Raigarh", "Ambikapur", "Durg", "Dhamtari", "Mahasamund", "Champa", "Kanker"
  ],
  "Goa": [
    "Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Cuncolim"
  ],
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar",
    "Junagadh", "Gandhinagar", "Anand", "Navsari", "Morbi", "Nadiad",
    "Surendranagar", "Bharuch", "Mehsana", "Bhuj", "Porbandar", "Vapi", "Valsad", "Godhra", "Patan"
  ],
  "Haryana": [
    "Gurugram", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak",
    "Hisar", "Karnal", "Sonipat", "Panchkula", "Bhiwani", "Sirsa",
    "Bahadurgarh", "Jind", "Thanesar", "Kaithal", "Rewari", "Palwal"
  ],
  "Himachal Pradesh": [
    "Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Manali",
    "Baddi", "Nahan", "Hamirpur", "Una", "Bilaspur", "Chamba", "Kangra"
  ],
  "Jharkhand": [
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Phusro",
    "Hazaribagh", "Giridih", "Ramgarh", "Medininagar", "Chirkunda", "Chaibasa", "Dumka"
  ],
  "Karnataka": [
    "Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Kalaburagi",
    "Davanagere", "Ballari", "Vijayapura", "Shivamogga", "Tumakuru", "Raichur",
    "Bidar", "Hosapete", "Gadag", "Hassan", "Udupi", "Mandya", "Chikmagalur", "Kolar"
  ],
  "Kerala": [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Kannur",
    "Alappuzha", "Kottayam", "Palakkad", "Malappuram", "Manjeri", "Thalassery",
    "Ponnani", "Vatakara", "Kanhangad", "Payyanur", "Kasaragod"
  ],
  "Madhya Pradesh": [
    "Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas",
    "Satna", "Ratlam", "Rewa", "Murwara (Katni)", "Singrauli", "Burhanpur",
    "Khandwa", "Bhind", "Chhindwara", "Guna", "Shivpuri", "Vidisha", "Damoh", "Mandsaur", "Khargone"
  ],
  "Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Kalyan-Dombivli", "Vasai-Virar",
    "Aurangabad (Chhatrapati Sambhajinagar)", "Navi Mumbai", "Solapur", "Mira-Bhayandar",
    "Bhiwandi", "Amravati", "Nanded", "Kolhapur", "Ulhasnagar", "Sangli-Miraj-Kupwad",
    "Malegaon", "Jalgaon", "Akola", "Latur", "Dhule", "Ahmednagar (Ahilyanagar)",
    "Chandrapur", "Parbhani", "Ichalkaranji", "Jalna", "Panvel", "Satara", "Beed",
    "Yavatmal", "Gondia", "Wardha", "Barshi", "Achalpur", "Osmanabad (Dharashiv)",
    "Nandurbar", "Ratnagiri", "Hingoli", "Washim", "Bhandara", "Gadchiroli", "Sindhudurg"
  ],
  "Manipur": [
    "Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching", "Ukhrul", "Senapati", "Tamenglong", "Jiribam"
  ],
  "Meghalaya": [
    "Shillong", "Tura", "Nongpoh", "Jowai", "Baghmara", "Williamnagar", "Resubelpara", "Mairang"
  ],
  "Mizoram": [
    "Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Lawngtlai", "Saiha", "Mamit"
  ],
  "Nagaland": [
    "Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon", "Phek"
  ],
  "Odisha": [
    "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri",
    "Balasore", "Bhadrak", "Baripada", "Jharsuguda", "Jeypore", "Bargarh", "Rayagada", "Bolangir", "Angul"
  ],
  "Punjab": [
    "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali (SAS Nagar)",
    "Hoshiarpur", "Batala", "Pathankot", "Moga", "Abohar", "Malerkotla", "Khanna",
    "Phagwara", "Muktsar", "Barnala", "Firozpur", "Kapurthala", "Rajpura"
  ],
  "Rajasthan": [
    "Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara",
    "Alwar", "Bharatpur", "Sikar", "Pali", "Sri Ganganagar", "Beawar", "Hanumangarh",
    "Kishangarh", "Tonk", "Dholpur", "Sawai Madhopur", "Churu", "Chittorgarh", "Barmer"
  ],
  "Sikkim": [
    "Gangtok", "Namchi", "Geyzing", "Mangan", "Rangpo", "Jorethang", "Singtam"
  ],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur",
    "Erode", "Tirunelveli", "Vellore", "Thoothukudi", "Dindigul", "Thanjavur",
    "Ranipet", "Sivakasi", "Karur", "Udhagamandalam (Ooty)", "Hosur", "Nagercoil", "Kanchipuram", "Kumbakonam"
  ],
  "Telangana": [
    "Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam",
    "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Siddipet", "Miryalaguda",
    "Jagtial", "Nirmal", "Sircilla", "Kamareddy", "Kothagudem", "Bodhan", "Palwancha", "Mancherial"
  ],
  "Tripura": [
    "Agartala", "Dharmanagar", "Udaipur", "Kailashahar", "Belonia", "Khowai", "Teliamura", "Melaghar", "Ambassa"
  ],
  "Uttar Pradesh": [
    "Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj (Allahabad)",
    "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur", "Noida", "Greater Noida",
    "Firozabad", "Jhansi", "Muzaffarnagar", "Mathura", "Ayodhya", "Rampur", "Shahjahanpur",
    "Farrukhabad", "Mau", "Hapur", "Etawah", "Mirzapur", "Bulandshahr", "Amroha", "Hardoi", "Sitapur"
  ],
  "Uttarakhand": [
    "Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur",
    "Rishikesh", "Pithoragarh", "Ramnagar", "Manglaur", "Nainital", "Mussoorie", "Almora", "Kotdwar"
  ],
  "West Bengal": [
    "Kolkata", "Asansol", "Siliguri", "Durgapur", "Bardhaman", "Malda", "Baharampur",
    "Habra", "Kharagpur", "Shantipur", "Dankuni", "Ranaghat", "Haldia", "Raiganj",
    "Krishnanagar", "Nabadwip", "Midnapore", "Jalpaiguri", "Balurghat", "Basirhat", "Bankura", "Darjeeling"
  ],
  "Andaman and Nicobar Islands": [
    "Port Blair", "Garacharma", "Bambooflat", "Diglipur", "Mayabunder", "Rangat"
  ],
  "Chandigarh": [
    "Chandigarh"
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Daman", "Diu", "Silvassa"
  ],
  "Delhi": [
    "New Delhi", "Central Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi",
    "North East Delhi", "North West Delhi", "South East Delhi", "South West Delhi", "Shahdara", "Dwarka", "Rohini"
  ],
  "Jammu and Kashmir": [
    "Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Sopore", "Udhampur",
    "Rajouri", "Punch", "Pulwama", "Kupwara", "Bandipora", "Budgam", "Ganderbal", "Kulgam"
  ],
  "Ladakh": [
    "Leh", "Kargil", "Diskit", "Padum"
  ],
  "Lakshadweep": [
    "Kavaratti", "Agatti", "Amini", "Andrott", "Minicoy"
  ],
  "Puducherry": [
    "Puducherry", "Ozhukarai", "Karaikal", "Mahe", "Yanam"
  ]
};

// GET /api/locations/states
router.get("/states", (_req: Request, res: Response) => {
  const states = Object.keys(INDIAN_LOCATIONS).sort();
  return res.json({ success: true, states });
});

// GET /api/locations/cities?state=Maharashtra
router.get("/cities", (req: Request, res: Response) => {
  const stateQuery = (req.query.state as string)?.trim();
  if (!stateQuery) {
    return res.status(400).json({ success: false, error: "Query param 'state' is required" });
  }

  const matchedKey = Object.keys(INDIAN_LOCATIONS).find(
    (k) => k.toLowerCase() === stateQuery.toLowerCase()
  );

  if (!matchedKey) {
    return res.json({ success: true, state: stateQuery, cities: [] });
  }

  return res.json({ success: true, state: matchedKey, cities: INDIAN_LOCATIONS[matchedKey] });
});

// GET /api/locations/all
router.get("/all", (_req: Request, res: Response) => {
  return res.json({ success: true, data: INDIAN_LOCATIONS });
});

export default router;

