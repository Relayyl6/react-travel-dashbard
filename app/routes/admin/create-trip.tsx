import { Header } from 'components';
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import type { Route } from './+types/create-trip';
import axios from 'axios';
import { comboBoxItems, selectItems } from '~/constants';
import { cn, formatKey } from '../../../assets/lib/utils';
import { useState } from 'react';
import { world_map } from '~/constants/world_map';
import { MapsComponent, LayersDirective, LayerDirective } from '@syncfusion/ej2-react-maps'
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { account } from '~/appwrite/client';
import { useNavigate } from 'react-router';

export const loader = async () => {
    const response = await axios.get('https://www.apicountries.com/countries');
    const data = response.data;
    // console.log(data);
    if (!Array.isArray(data)) {
      throw new Error("Countries API did not return an array");
    }

    return data.map((country: any) => ({
      flag: `${country.flag}`,
      name: `${country.name}`,
      coordinates: country.latlng as [number, number],
      value: `${country.name}`,
      openStreetMap: `${country.maps?.openStreetMap}`,
    }));
}

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
  const countries = loaderData as Country[];
  const navigate = useNavigate();

  const [ formData, setFormData ] = useState<TripFormData>({
    country: countries[0]?.name || '',
    travelStyle: '',
    interest: '',
    budget: '',
    duration: 0,
    groupType: '',
  });

  const [ error, setError ] = useState<string | null>(null);

  const [ loading, setLoading ] = useState<boolean>(false)

  const countryData = countries.map((country) => ({
        flag: country.flag,
        name: country.name,
        value: country.value,
  }))

  const mapData = [
    {
      country: formData.country,
      color: '#EA382E',
      coordinates: countries.find((c: Country) => c.name === formData.country)?.coordinates || []
    }
  ]

  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setFormData({
      ...formData, [key]: value
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    // TODO: update form data to include specification of missing fields
    if (!formData.country || !formData.travelStyle || !formData.interest || !formData.budget || !formData.groupType) {
    const missing = [
      !formData.country && 'Country',
      !formData.travelStyle && 'Travel style', 
      !formData.interest && 'Interest',
      !formData.budget && 'Budget',
      !formData.groupType && 'Group type'
    ].filter(Boolean).join(', ');

    setError(`Please provide values for: ${missing}`);
    setLoading(false);
    return;
    }

    if (formData.duration < 1 || formData.duration > 10 ) {
      setError("Duration must be between 1 to 10 days");
      setLoading(false);
      return;
    }

    const user = await account.get();
    if (!user.$id) {
      console.error("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/create-trip", {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          interest: formData.interest,
          budget: formData.budget,
          travelStyle: formData.travelStyle,
          groupType: formData.groupType,
          userId: user.$id
        })
      });

      const result: CreateTripResponse = await response.json();

      if (result?.id) navigate(`/trips/${result.id}`)
      else console.error("Failed to generate a trip")
    } catch(error) {
      console.error("Error generating trip", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='flex flex-col gap-10 pb-20 wrapper'>
      <Header
        title="Add a New Trip"
        description='View and Edit AI-generated Travel Plans'
      />

      <section className='mt-2.5 wrapper-md'>
        <form className='flex flex-col gap-6 py-6 bg-white border border-light-200 rounded-xl shadow-100' onSubmit={handleSubmit}>
          <div className='w-full flex flex-col gap-2.5 px-6 relative'>
            <label htmlFor='country'>Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: 'name', value: 'value' }}
              placeholder='Select a Country'
              className='!p-3.5 !border w-full !border-light-400 !rounded-xl !text-base !text-dark-300 !font-normal'
              itemTemplate={(data: any) => (
                <div className="flex flex-row items-center gap-0.5">
                  <img src={data.flag} className="!size-6 !rounded-xl !ml-2 !items-center !flex !justify-center"/>
                  <span className="!text-black">{data.name}</span>
                </div>
              )}
              change={(event: { value: string | undefined }) => {
                if (event.value) {
                  handleChange('country', event.value)
                }
              }}
              allowFiltering
              filtering={(event) => {
                const query = event.text.toLowerCase();
                event.updateData(
                  countryData.filter((country) => country.name.toLowerCase().includes(query)).map((country) => ({
                    flag: country.flag,
                    name: country.name,
                    value: country.value,
                  })))
              }}
            />
          </div>

          <div className='w-full flex flex-col gap-2.5 px-6 relative'>
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              name="duration"
              placeholder="Enter a number of days"
              className="p-3.5 border border-light-400 rounded-xl text-base text-dark-300 font-normal placeholder:text-gray-100"
              onChange={(event) => handleChange("duration", Number(event.target.value))}
            />
          </div>

          {
            selectItems.map((key) => (
              <div key={key} className='w-full flex flex-col gap-2.5 px-6 relative'>
                <label htmlFor={key}>{formatKey(key)}</label>

                <ComboBoxComponent
                  id={key}
                  dataSource={comboBoxItems[key].map((item) => ({
                    text: item,
                    value: item,
                  }))}
                  fields={{ text: 'text', value: 'value' }}
                  placeholder={`Select ${formatKey(key)}`}
                  change={(event: { value: string | undefined }) => {
                    if (event.value) {
                      handleChange(key, event.value)
                    }
                  }}
                  allowFiltering
                  filtering={(event) => {
                    const query = event.text.toLowerCase();
                    event.updateData(
                      comboBoxItems[key].filter((item) => item.toLowerCase().includes(query)).map((item) => ({
                        text: item,
                        value: item,
                  })))
                  }}
                  className="!p-3.5 !border !w-full !border-light-400 !rounded-xl !text-base !text-dark-300 !font-normal"
                />
              </div>
            ))
          }

          <div className='w-full flex flex-col gap-2.5 px-6 relative'>
            <label htmlFor="location">Location on the world map</label>

            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  dataSource={mapData}
                  shapeData={world_map}
                  shapePropertyPath="name"
                  shapeDataPath="country"
                  shapeSettings={{ colorValuePath: 'color', fill: '#E5E5E5' }}
                  />
              </LayersDirective>
            </MapsComponent>
          </div>

          <div
            className='bg-gray-200 h-px w-full'
          />

          {
            error && (
              <div className="text-red-500 text-base font-medium text-center">
                <p>{error}</p>
              </div>
            )
          }

          <footer className='px-6 w-full'>
            <ButtonComponent
              type="submit"
              className='!h-12 !w-full !bg-primary-100 !px-4 !rounded-lg !flex !items-center !justify-center !mx-auto !gap-1.5 !shadow-none'
              disabled={loading}>
                <img
                  src={`/public/assets/icons/${loading ? "loader.svg" : "magic-star.svg"}`}
                  className={cn('size-5', { 'animate-spin': loading })}
                />
                <span className="p-16-semibold text-white">
                  {
                    loading ? "Generating" : "Generate Trip"
                  }
                </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  )
}

export default CreateTrip