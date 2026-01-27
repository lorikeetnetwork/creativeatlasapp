

## Quick Add Feature for Master Account

### Overview
Create a streamlined "Quick Add" feature that allows the master account to rapidly add locations directly from the map interface. This will include both a floating action button on the map and click-to-pin functionality for setting coordinates.

---

### User Experience Flow

```text
┌─────────────────────────────────────────────────────────────────┐
│  MAP VIEW (Master Account)                                       │
│                                                                   │
│    [Map Canvas - clickable when in add mode]                     │
│                                                                   │
│         📍 Click to drop pin                                     │
│                                                                   │
│                                    ┌─────────────────┐           │
│                                    │  + Quick Add    │           │
│                                    └─────────────────┘           │
│                                         (FAB button)             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  QUICK ADD MODAL (Minimal Fields)                                │
│  ─────────────────────────────────                               │
│                                                                   │
│  Name: [________________________]                                │
│                                                                   │
│  Category: [▼ Select category...]                                │
│                                                                   │
│  Address: [🔍 Search or click map to set]                        │
│  Coordinates: -27.4705, 153.0260 ✓                              │
│                                                                   │
│  Status: [● Active  ○ Pending]                                   │
│                                                                   │
│  Website: [________________________] (optional)                  │
│                                                                   │
│            [Cancel]    [Add Location →]                          │
│                        [Add & Continue +]                        │
└─────────────────────────────────────────────────────────────────┘
```

---

### Step 1: Create QuickAddLocation Component

**New file: `src/components/admin/QuickAddLocation.tsx`**

A minimal form modal with only essential fields for rapid entry:
- **Name** (required)
- **Category** (required, dropdown with 12 categories)
- **Address** (with Mapbox autocomplete OR coordinates from map click)
- **Status** (toggle: Active/Pending, default Active for master)
- **Website** (optional, auto-fetches OG image on blur)

Features:
- "Add & Continue" button to add and immediately open fresh form for next location
- Real-time coordinate display when clicking map
- Auto-geocoding from address search
- Minimal validation (just name, category, address)
- Toast confirmation on success

---

### Step 2: Add Map Click-to-Pin Mode

**Modify: `src/components/MapView.tsx`**

Add props to enable "add mode":
- `isAddMode?: boolean` - When true, clicking the map captures coordinates
- `onMapClick?: (coords: {lat: number, lng: number}) => void` - Callback for clicked coordinates
- Display crosshair cursor when in add mode
- Show temporary marker at click location

---

### Step 3: Create QuickAddButton Component

**New file: `src/components/admin/QuickAddButton.tsx`**

A floating action button (FAB) that:
- Only visible to master account users
- Uses `useCollaboratorRole` hook to check `isMaster`
- Positioned bottom-right of map (above other controls)
- Opens the QuickAddLocation modal on click

---

### Step 4: Integrate into Index.tsx (Map Page)

**Modify: `src/pages/Index.tsx`**

Add the Quick Add functionality:
- Import `QuickAddButton` and `QuickAddLocation` components
- Add state for `isQuickAddOpen` and `quickAddCoords`
- Pass `isAddMode` and `onMapClick` props to MapView when modal is open
- Render QuickAddButton for master users
- Render QuickAddLocation modal with coordinate passthrough

---

### Step 5: Add Reverse Geocoding for Map Clicks

**Create helper: `src/utils/reverseGeocode.ts`**

When user clicks on map:
1. Capture lat/lng coordinates
2. Call Mapbox reverse geocoding API
3. Parse response to extract address, suburb, state, postcode
4. Auto-fill address fields in the form

---

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/admin/QuickAddLocation.tsx` | Main quick add modal component |
| `src/components/admin/QuickAddButton.tsx` | FAB button for master users |
| `src/utils/reverseGeocode.ts` | Reverse geocoding helper function |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/MapView.tsx` | Add `isAddMode`, `onMapClick` props, cursor change, temp marker |
| `src/pages/Index.tsx` | Integrate QuickAddButton, modal state, coordinate handling |

---

### Technical Details

**QuickAddLocation Form Schema (Zod):**
```typescript
const quickAddSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().min(1, "Category is required"),
  address: z.string().min(1, "Address is required"),
  suburb: z.string().min(1, "Suburb is required"),
  state: z.string().min(1, "State is required"),
  postcode: z.string().min(1, "Postcode is required"),
  country: z.string().default("Australia"),
  latitude: z.number(),
  longitude: z.number(),
  website: z.string().url().optional().or(z.literal("")),
  status: z.enum(["Active", "Pending"]).default("Active"),
});
```

**Insert with master source:**
```typescript
// Set status directly to Active and source to "AdminAdded"
const { data, error } = await supabase
  .from('locations')
  .insert({
    name: data.name,
    category: data.category,
    address: data.address,
    suburb: data.suburb,
    state: data.state,
    postcode: data.postcode,
    country: data.country,
    latitude: data.latitude,
    longitude: data.longitude,
    website: data.website || null,
    status: data.status,
    source: "AdminAdded",
    owner_user_id: null, // Admin-added locations don't have owner
  })
  .select()
  .single();
```

**Map click handler in MapView:**
```typescript
// When isAddMode is true
map.current.on('click', (e) => {
  if (isAddMode && onMapClick) {
    onMapClick({
      lat: e.lngLat.lat,
      lng: e.lngLat.lng
    });
  }
});
```

---

### Security Considerations

- The QuickAddButton and modal only render when `isMaster === true`
- RLS policies already allow admin/master to insert locations
- No new database changes required - uses existing `locations` table and RLS

---

### Summary

| Feature | Description |
|---------|-------------|
| **Quick Add Button** | FAB visible only to master account on map |
| **Minimal Form** | Only 5-6 essential fields vs 15+ in full form |
| **Map Click Mode** | Click anywhere on map to set coordinates |
| **Reverse Geocoding** | Auto-fill address from map click |
| **Add & Continue** | Quickly add multiple locations in sequence |
| **Active by Default** | Skip review queue for master additions |

